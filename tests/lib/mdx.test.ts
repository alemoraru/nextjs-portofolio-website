import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getReadingTime } from "@/lib/utils"

type MdxModule = typeof import("@/lib/mdx")

let root: string

/** Writes a file under the fixture root, creating parent directories as needed. */
function write(relPath: string, content: string) {
  const fullPath = path.join(root, relPath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content)
  return fullPath
}

/** Returns the source of a blog post MDX file with valid frontmatter. */
function blogPost({
  title,
  date,
  tags,
  body = "Hello.",
}: {
  title: string
  date: string
  tags?: string[]
  body?: string
}) {
  const tagLines = tags ? `tags:\n${tags.map(t => `  - ${t}`).join("\n")}\n` : ""
  return `---\ntitle: ${title}\nsummary: Summary of ${title}\ndate: ${date}\n${tagLines}---\n\n${body}\n`
}

/** Returns the source of a work item MDX file for a fictional employer. */
function workItem({ title, start, end }: { title: string; start: string; end: string }) {
  return `---\ncompany: Acme\ntitle: ${title}\nstart: ${start}\nend: ${end}\ndescription: Work at Acme\nlocations:\n  - Remote\ntechStack:\n  - TypeScript\n---\n\nBody.\n`
}

/** Returns the source of a project MDX file with valid frontmatter. */
function project({
  title,
  startDate,
  endDate,
  techStack,
}: {
  title: string
  startDate: string
  endDate: string
  techStack: string[]
}) {
  const stack = techStack.map(t => `  - ${t}`).join("\n")
  return `---\ntitle: ${title}\nimage: /img/${title}.png\ndescription: About ${title}\nstartDate: ${startDate}\nendDate: ${endDate}\ntechStack:\n${stack}\nteamSize: 3\n---\n\nBody.\n`
}

/** Re-imports `mdx.ts` so that its module-level cache is empty. */
async function loadMdx(): Promise<MdxModule> {
  vi.resetModules()
  return import("@/lib/mdx")
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "mdx-test-"))
  vi.spyOn(process, "cwd").mockReturnValue(root)
})

afterEach(() => {
  vi.restoreAllMocks()
  fs.rmSync(root, { recursive: true, force: true })
})

describe("getAllBlogPosts", () => {
  it("parses frontmatter, sorts newest first, and derives slug and reading time", async () => {
    const olderPath = write(
      "src/data/blog/older.mdx",
      blogPost({ title: "Older", date: "2023-03-01", tags: ["React", "CSS"] })
    )
    write(
      "src/data/blog/newer.mdx",
      blogPost({ title: "Newer", date: "2024-06-10", body: Array(250).fill("word").join(" ") })
    )

    const { getAllBlogPosts } = await loadMdx()
    const posts = await getAllBlogPosts()

    expect(posts.map(p => p.slug)).toEqual(["newer", "older"])
    expect(posts[0]).toMatchObject({
      title: "Newer",
      summary: "Summary of Newer",
      date: "2024-06-10",
    })
    expect(posts[1].tags).toEqual(["react", "css"])
    expect(posts[1].readingTime).toBe(getReadingTime(fs.readFileSync(olderPath, "utf-8")))
    expect(posts[0].readingTime).toBeGreaterThan(posts[1].readingTime ?? 0)
  })

  it("ignores files that are not .mdx", async () => {
    write("src/data/blog/post.mdx", blogPost({ title: "Post", date: "2024-01-01" }))
    write("src/data/blog/notes.txt", "not a post")
    write("src/data/blog/README.md", "# not a post")

    const { getAllBlogPosts } = await loadMdx()
    const posts = await getAllBlogPosts()

    expect(posts.map(p => p.slug)).toEqual(["post"])
  })

  it("throws a file-specific error when frontmatter fails schema validation", async () => {
    write("src/data/blog/bad-date.mdx", blogPost({ title: "Bad", date: "January 1st" }))

    const { getAllBlogPosts } = await loadMdx()

    await expect(getAllBlogPosts()).rejects.toThrow(
      "Invalid frontmatter in bad-date.mdx: date: Must be YYYY-MM-DD"
    )
  })

  it("throws a file-specific error when the MDX cannot be parsed", async () => {
    write("src/data/blog/broken.mdx", "---\ntitle: [unclosed\n---\n\nBody.\n")

    const { getAllBlogPosts } = await loadMdx()

    await expect(getAllBlogPosts()).rejects.toThrow(/Failed to parse broken\.mdx/)
  })

  it("rejects when the content directory does not exist", async () => {
    const { getAllBlogPosts } = await loadMdx()

    await expect(getAllBlogPosts()).rejects.toThrow(/ENOENT/)
  })

  it("returns the same cached array on subsequent calls", async () => {
    write("src/data/blog/post.mdx", blogPost({ title: "Post", date: "2024-01-01" }))

    const { getAllBlogPosts } = await loadMdx()
    const first = await getAllBlogPosts()
    const second = await getAllBlogPosts()

    expect(second).toBe(first)
  })
})

describe("getAllProjects", () => {
  it("maps every frontmatter field onto the project props", async () => {
    write(
      "src/data/projects/project-A.mdx",
      project({
        title: "Project A",
        startDate: "2022-01",
        endDate: "2023-01",
        techStack: ["Go", "Redis"],
      })
    )

    const { getAllProjects } = await loadMdx()
    const [item] = await getAllProjects()

    expect(item).toEqual({
      slug: "project-A",
      title: "Project A",
      image: "/img/Project A.png",
      description: "About Project A",
      startDate: "2022-01",
      endDate: "2023-01",
      techStack: ["Go", "Redis"],
      teamSize: 3,
      role: undefined,
      githubUrl: undefined,
      paperUrl: undefined,
    })
  })

  it("returns the same cached array on subsequent calls", async () => {
    write(
      "src/data/projects/project-A.mdx",
      project({ title: "Project A", startDate: "2022-01", endDate: "2023-01", techStack: ["Go"] })
    )

    const { getAllProjects } = await loadMdx()
    const first = await getAllProjects()

    expect(await getAllProjects()).toBe(first)
  })

  it("throws when a required frontmatter field is missing", async () => {
    write("src/data/projects/incomplete.mdx", "---\ntitle: Only a title\n---\n\nBody.\n")

    const { getAllProjects } = await loadMdx()

    await expect(getAllProjects()).rejects.toThrow(/^Invalid frontmatter in incomplete\.mdx: /)
  })
})

describe("getAllWorkItems", () => {
  it("sorts by end date descending, treating 'Present' as the current time", async () => {
    write(
      "src/data/work/Old.mdx",
      workItem({ title: "Old role", start: "Jan 2015", end: "Dec 2016" })
    )
    write(
      "src/data/work/Current.mdx",
      workItem({ title: "Current role", start: "Jan 2020", end: "Present" })
    )
    write(
      "src/data/work/Middle.mdx",
      workItem({ title: "Middle role", start: "Jan 2017", end: "Jun 2019" })
    )

    const { getAllWorkItems } = await loadMdx()
    const items = await getAllWorkItems()

    expect(items.map(i => i.slug)).toEqual(["Current", "Middle", "Old"])
    expect(items[0]).toMatchObject({ company: "Acme", end: "Present", techStack: ["TypeScript"] })
  })

  it("returns the same cached array on subsequent calls", async () => {
    write("src/data/work/Role.mdx", workItem({ title: "Role", start: "Jan 2020", end: "Dec 2020" }))

    const { getAllWorkItems } = await loadMdx()
    const first = await getAllWorkItems()

    expect(await getAllWorkItems()).toBe(first)
  })

  it("throws a file-specific error when work frontmatter is invalid", async () => {
    write("src/data/work/Broken.mdx", "---\ncompany: Acme\ntitle: Broken\n---\n\nBody.\n")

    const { getAllWorkItems } = await loadMdx()

    await expect(getAllWorkItems()).rejects.toThrow(/^Invalid frontmatter in Broken\.mdx: /)
  })
})
