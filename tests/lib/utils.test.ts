import { describe, it, expect } from "vitest"
import {
  cn,
  formatDuration,
  calculateDuration,
  normalizeTechName,
  getReadingTime,
  diceCoefficient,
  getClosestTagPosts,
  filterBlogPosts,
  sortBlogPosts,
  filterWorkItems,
  sortWorkItems,
  filterProjects,
  sortProjects,
  paginateItems,
} from "@/lib/utils"
import type { BlogPostProps, ProjectProps, WorkItemProps } from "@/lib/types"

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
  })

  it("should handle conditional classes", () => {
    expect(cn("px-2", false && "py-1", "py-2")).toBe("px-2 py-2")
  })

  it("should handle arrays", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1")
  })

  it("should handle objects", () => {
    expect(cn({ "px-2": true, "py-1": false, "py-2": true })).toBe("px-2 py-2")
  })

  it("should merge Tailwind conflicting classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("should handle empty inputs", () => {
    expect(cn()).toBe("")
  })

  it("should handle undefined and null", () => {
    expect(cn("px-2", undefined, null, "py-1")).toBe("px-2 py-1")
  })
})

describe("formatDuration", () => {
  it("should format duration with Present as end date", () => {
    expect(formatDuration("2020-01", "Present")).toBe("Jan 2020 – Present")
  })

  it("should format duration within same year", () => {
    expect(formatDuration("2020-01", "2020-06")).toBe("Jan – Jun 2020")
  })

  it("should format duration across different years", () => {
    expect(formatDuration("2020-01", "2021-06")).toBe("Jan 2020 – Jun 2021")
  })

  it("should format all 12 months correctly", () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    months.forEach((month, index) => {
      const monthNum = (index + 1).toString().padStart(2, "0")
      const result = formatDuration(`2020-${monthNum}`, "Present")
      expect(result).toBe(`${month} 2020 – Present`)
    })
  })

  it("should handle single digit months", () => {
    expect(formatDuration("2020-1", "2020-12")).toBe("Jan – Dec 2020")
  })
})

describe("calculateDuration", () => {
  describe("with Present/Current", () => {
    it('should handle "Present" as end date', () => {
      const result = calculateDuration("2020-01", "Present")
      // This will vary based on current date, so we just check it returns a string
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle "current" as end date (case insensitive)', () => {
      const result = calculateDuration("2020-01", "current")
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe("with month-year format (Jan 2020)", () => {
    it("should calculate duration less than 1 year", () => {
      expect(calculateDuration("Jan 2020", "Jun 2020")).toBe("5 mos")
    })

    it("should calculate duration of exactly 1 year", () => {
      expect(calculateDuration("Jan 2020", "Jan 2021")).toBe("1 yr")
    })

    it("should calculate duration of multiple years", () => {
      expect(calculateDuration("Jan 2020", "Jan 2023")).toBe("3 yrs")
    })

    it("should calculate duration with years and months", () => {
      expect(calculateDuration("Jan 2020", "Jun 2021")).toBe("1 yr 5 mos")
    })

    it("should handle single month duration", () => {
      expect(calculateDuration("Jan 2020", "Feb 2020")).toBe("1 mo")
    })

    it("should handle zero months as 1 month", () => {
      expect(calculateDuration("Jan 2020", "Jan 2020")).toBe("1 mo")
    })
  })

  describe("with full month name (January 2020)", () => {
    it("should handle full month names", () => {
      expect(calculateDuration("January 2020", "June 2020")).toBe("5 mos")
    })

    it("should calculate years with full month names", () => {
      expect(calculateDuration("January 2020", "March 2022")).toBe("2 yrs 2 mos")
    })
  })

  describe("with YYYY-MM format", () => {
    it("should calculate duration with dash format", () => {
      expect(calculateDuration("2020-01", "2020-06")).toBe("5 mos")
    })

    it("should calculate years with dash format", () => {
      expect(calculateDuration("2020-01", "2022-03")).toBe("2 yrs 2 mos")
    })
  })

  describe("with YYYY/MM format", () => {
    it("should calculate duration with slash format", () => {
      expect(calculateDuration("2020/01", "2020/06")).toBe("5 mos")
    })
  })

  describe("pluralization", () => {
    it("should use singular for 1 month", () => {
      expect(calculateDuration("2020-01", "2020-02")).toBe("1 mo")
    })

    it("should use plural for multiple months", () => {
      expect(calculateDuration("2020-01", "2020-03")).toBe("2 mos")
    })

    it("should use singular for 1 year", () => {
      expect(calculateDuration("2020-01", "2021-01")).toBe("1 yr")
    })

    it("should use plural for multiple years", () => {
      expect(calculateDuration("2020-01", "2023-01")).toBe("3 yrs")
    })

    it("should use correct pluralization for combined duration", () => {
      expect(calculateDuration("2020-01", "2021-02")).toBe("1 yr 1 mo")
      expect(calculateDuration("2020-01", "2022-03")).toBe("2 yrs 2 mos")
    })
  })

  describe("edge cases", () => {
    it("should handle same month and year", () => {
      expect(calculateDuration("2020-01", "2020-01")).toBe("1 mo")
    })

    it("should handle exactly 12 months as 1 year", () => {
      expect(calculateDuration("2020-01", "2021-01")).toBe("1 yr")
    })

    it("should handle leap year calculations", () => {
      expect(calculateDuration("2020-02", "2021-02")).toBe("1 yr")
    })
  })
})

describe("normalizeTechName", () => {
  describe("basic normalization", () => {
    it("should convert to lowercase", () => {
      expect(normalizeTechName("TypeScript")).toBe("typescript")
      expect(normalizeTechName("JAVASCRIPT")).toBe("javascript")
    })

    it("should trim whitespace", () => {
      expect(normalizeTechName("  react  ")).toBe("react")
      expect(normalizeTechName("\ttypescript\n")).toBe("typescript")
    })

    it("should replace spaces with hyphens", () => {
      expect(normalizeTechName("React Native")).toBe("react-native")
      expect(normalizeTechName("Node js")).toBe("node-js")
    })

    it("should replace multiple spaces with single hyphen", () => {
      expect(normalizeTechName("React    Native")).toBe("react-native")
      expect(normalizeTechName("Spring   Boot")).toBe("spring-boot")
    })
  })

  describe("special character handling", () => {
    it("should replace dots with hyphens", () => {
      expect(normalizeTechName("node.js")).toBe("node-js")
      expect(normalizeTechName("web3.js")).toBe("web3-js")
      expect(normalizeTechName("Vue.js")).toBe("vue-js")
    })

    it("should replace underscores with hyphens", () => {
      expect(normalizeTechName("next_js")).toBe("next-js")
      expect(normalizeTechName("snake_case_name")).toBe("snake-case-name")
    })

    it("should remove special characters", () => {
      expect(normalizeTechName("C++")).toBe("c")
      expect(normalizeTechName("C#")).toBe("c")
      expect(normalizeTechName("@angular/core")).toBe("angularcore")
      expect(normalizeTechName("react!")).toBe("react")
    })

    it("should preserve alphanumeric and hyphens", () => {
      expect(normalizeTechName("html5")).toBe("html5")
      expect(normalizeTechName("css3")).toBe("css3")
      expect(normalizeTechName("vue-3")).toBe("vue-3")
    })
  })

  describe("hyphen normalization", () => {
    it("should replace multiple hyphens with single hyphen", () => {
      expect(normalizeTechName("react--native")).toBe("react-native")
      expect(normalizeTechName("next---js")).toBe("next-js")
    })

    it("should remove leading hyphens", () => {
      expect(normalizeTechName("-react")).toBe("react")
      expect(normalizeTechName("--typescript")).toBe("typescript")
    })

    it("should remove trailing hyphens", () => {
      expect(normalizeTechName("react-")).toBe("react")
      expect(normalizeTechName("typescript--")).toBe("typescript")
    })

    it("should remove leading and trailing hyphens", () => {
      expect(normalizeTechName("-react-")).toBe("react")
      expect(normalizeTechName("--next-js--")).toBe("next-js")
    })
  })

  describe("complex combinations", () => {
    it("should handle mixed special characters", () => {
      expect(normalizeTechName("Node.js (LTS)")).toBe("node-js-lts")
      expect(normalizeTechName("Vue.js 3.x")).toBe("vue-js-3-x")
    })

    it("should handle multiple transformations", () => {
      expect(normalizeTechName("  React_Native  2.0  ")).toBe("react-native-2-0")
      expect(normalizeTechName("AWS_IOT.Core")).toBe("aws-iot-core")
    })

    it("should handle package names", () => {
      expect(normalizeTechName("@types/node")).toBe("typesnode")
      expect(normalizeTechName("@testing-library/react")).toBe("testing-libraryreact")
    })

    it("should handle version strings", () => {
      expect(normalizeTechName("Python 3.9")).toBe("python-3-9")
      expect(normalizeTechName("Java 11.0.2")).toBe("java-11-0-2")
    })
  })

  describe("edge cases", () => {
    it("should handle empty string", () => {
      expect(normalizeTechName("")).toBe("")
    })

    it("should handle only special characters", () => {
      expect(normalizeTechName("@#$%")).toBe("")
      expect(normalizeTechName("!!!")).toBe("")
    })

    it("should handle only spaces", () => {
      expect(normalizeTechName("   ")).toBe("")
    })

    it("should handle only hyphens", () => {
      expect(normalizeTechName("---")).toBe("")
    })

    it("should handle unicode characters", () => {
      expect(normalizeTechName("React™")).toBe("react")
      expect(normalizeTechName("Vue©")).toBe("vue")
    })
  })

  describe("real-world examples", () => {
    it("should normalize common tech names", () => {
      expect(normalizeTechName("Next.js")).toBe("next-js")
      expect(normalizeTechName("React Native")).toBe("react-native")
      expect(normalizeTechName("Node.js")).toBe("node-js")
      expect(normalizeTechName("Spring Boot")).toBe("spring-boot")
      expect(normalizeTechName("AWS IoT")).toBe("aws-iot")
    })

    it("should normalize database names", () => {
      expect(normalizeTechName("MongoDB")).toBe("mongodb")
      expect(normalizeTechName("PostgreSQL")).toBe("postgresql")
      expect(normalizeTechName("MySQL")).toBe("mysql")
    })

    it("should normalize framework names", () => {
      expect(normalizeTechName("TailwindCSS")).toBe("tailwindcss")
      expect(normalizeTechName("Express.js")).toBe("express-js")
      expect(normalizeTechName("FastAPI")).toBe("fastapi")
    })
  })
})

describe("getReadingTime", () => {
  it("should return 1 for a very short text", () => {
    expect(getReadingTime("hello world")).toBe(1)
  })

  it("should round up to the nearest minute", () => {
    // 101 words → Math.ceil(101/100) = 2
    const text = Array(101).fill("word").join(" ")
    expect(getReadingTime(text)).toBe(2)
  })

  it("should trim leading/trailing whitespace before counting", () => {
    const text = "  " + Array(100).fill("word").join(" ") + "  "
    expect(getReadingTime(text)).toBe(1)
  })

  it("should handle exactly 100 words as 1 minute", () => {
    const text = Array(100).fill("word").join(" ")
    expect(getReadingTime(text)).toBe(1)
  })

  it("should handle 200 words as 2 minutes", () => {
    const text = Array(200).fill("word").join(" ")
    expect(getReadingTime(text)).toBe(2)
  })
})

describe("diceCoefficient", () => {
  it("should return 1 for identical strings", () => {
    expect(diceCoefficient("typescript", "typescript")).toBe(1)
  })

  it("should return 0 for empty strings", () => {
    expect(diceCoefficient("", "react")).toBe(0)
    expect(diceCoefficient("react", "")).toBe(0)
    expect(diceCoefficient("", "")).toBe(0)
  })

  it("should return 0 for completely dissimilar strings", () => {
    // No shared bigrams between "ab" and "cd"
    expect(diceCoefficient("ab", "cd")).toBe(0)
  })

  it("should return a value between 0 and 1 for similar strings", () => {
    const score = diceCoefficient("javascript", "typescript")
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThan(1)
  })

  it("should be case-insensitive", () => {
    expect(diceCoefficient("React", "react")).toBe(1)
    expect(diceCoefficient("TypeScript", "typescript")).toBe(1)
  })

  it("similar tags should score higher than dissimilar tags", () => {
    const scoreHigh = diceCoefficient("react", "reactjs")
    const scoreLow = diceCoefficient("react", "python")
    expect(scoreHigh).toBeGreaterThan(scoreLow)
  })
})

describe("getClosestTagPosts", () => {
  const posts: BlogPostProps[] = [
    { slug: "a", title: "A", summary: "", date: "2024-01-01", tags: ["typescript"] },
    { slug: "b", title: "B", summary: "", date: "2024-01-02", tags: ["javascript"] },
    { slug: "c", title: "C", summary: "", date: "2024-01-03", tags: ["python"] },
    { slug: "d", title: "D", summary: "", date: "2024-01-04", tags: [] },
  ]

  it("should return posts with the highest tag similarity", () => {
    const results = getClosestTagPosts(posts, "typescrypt")
    expect(results.length).toBeGreaterThan(0)
    // "typescript" is the most similar to "typescrypt"
    expect(results[0].bestTag).toBe("typescript")
  })

  it("should exclude posts with zero similarity", () => {
    // Posts with no tags should not appear
    const results = getClosestTagPosts(posts, "typescript")
    expect(results.every(r => r.bestScore > 0)).toBe(true)
  })

  it("should respect the maxPosts limit", () => {
    const results = getClosestTagPosts(posts, "script", 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })

  it("should sort results by descending similarity score", () => {
    const results = getClosestTagPosts(posts, "typescript")
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].bestScore).toBeGreaterThanOrEqual(results[i].bestScore)
    }
  })

  it("should return empty array when no posts have any tags", () => {
    const emptyPosts: BlogPostProps[] = [
      { slug: "x", title: "X", summary: "", date: "2024-01-01", tags: [] },
    ]
    expect(getClosestTagPosts(emptyPosts, "typescript")).toEqual([])
  })
})

describe("Blog helpers", () => {
  const blogPosts: BlogPostProps[] = [
    { slug: "a", title: "A", summary: "", date: "2024-03-01", tags: ["react", "typescript"] },
    { slug: "b", title: "B", summary: "", date: "2024-01-01", tags: ["python"] },
    { slug: "c", title: "C", summary: "", date: "2024-06-01", tags: ["react"] },
    { slug: "d", title: "D", summary: "", date: "2023-12-01", tags: [] },
  ]

  describe("filterBlogPosts", () => {
    it("should return all posts when no tags selected", () => {
      expect(filterBlogPosts(blogPosts, [])).toHaveLength(4)
    })

    it("should filter posts that match any selected tag", () => {
      const result = filterBlogPosts(blogPosts, ["react"])
      expect(result.map(p => p.slug)).toEqual(["a", "c"])
    })

    it("should match posts with any of the selected tags (OR logic)", () => {
      const result = filterBlogPosts(blogPosts, ["react", "python"])
      expect(result.map(p => p.slug)).toEqual(["a", "b", "c"])
    })

    it("should return empty array when no posts match", () => {
      expect(filterBlogPosts(blogPosts, ["golang"])).toHaveLength(0)
    })

    it("should not mutate the original array", () => {
      const original = [...blogPosts]
      filterBlogPosts(blogPosts, ["react"])
      expect(blogPosts).toEqual(original)
    })
  })

  describe("sortBlogPosts", () => {
    it("should sort by date descending by default (desc)", () => {
      const result = sortBlogPosts(blogPosts, "desc")
      expect(result.map(p => p.slug)).toEqual(["c", "a", "b", "d"])
    })

    it("should sort by date ascending (asc)", () => {
      const result = sortBlogPosts(blogPosts, "asc")
      expect(result.map(p => p.slug)).toEqual(["d", "b", "a", "c"])
    })

    it("should not mutate the original array", () => {
      const original = [...blogPosts]
      sortBlogPosts(blogPosts, "desc")
      expect(blogPosts).toEqual(original)
    })
  })
})

describe("Work helpers", () => {
  const workItems: WorkItemProps[] = [
    {
      slug: "current",
      company: "Acme",
      title: "Engineer",
      start: "Jan 2023",
      end: "Present",
      description: "",
      locations: [],
    },
    {
      slug: "older",
      company: "Beta",
      title: "Dev",
      start: "Jan 2021",
      end: "Dec 2022",
      description: "",
      locations: [],
    },
    {
      slug: "newest-past",
      company: "Gamma",
      title: "Lead",
      start: "Jan 2022",
      end: "Dec 2023",
      description: "",
      locations: [],
    },
  ]

  describe("filterWorkItems", () => {
    it("should return all items when no companies selected", () => {
      expect(filterWorkItems(workItems, [])).toHaveLength(3)
    })

    it("should filter to exact company match", () => {
      const result = filterWorkItems(workItems, ["Acme"])
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe("current")
    })

    it("should support multiple companies (OR logic)", () => {
      const result = filterWorkItems(workItems, ["Acme", "Beta"])
      expect(result).toHaveLength(2)
    })

    it("should return empty when no match", () => {
      expect(filterWorkItems(workItems, ["Unknown"])).toHaveLength(0)
    })
  })

  describe("sortWorkItems", () => {
    it("should place Present items first when sorting newest", () => {
      const result = sortWorkItems(workItems, "newest")
      expect(result[0].end).toBe("Present")
    })

    it("should sort past items by end date descending when sorting newest", () => {
      const result = sortWorkItems(workItems, "newest")
      const past = result.filter(w => w.end !== "Present")
      expect(past[0].slug).toBe("newest-past") // Dec 2023 > Dec 2022
    })

    it("should sort by start date ascending when sorting oldest", () => {
      const result = sortWorkItems(workItems, "oldest")
      expect(result[0].slug).toBe("older") // Jan 2021
    })

    it("should not mutate the original array", () => {
      const original = [...workItems]
      sortWorkItems(workItems, "newest")
      expect(workItems).toEqual(original)
    })
  })
})

describe("Project helpers", () => {
  const projects: ProjectProps[] = [
    {
      slug: "p1",
      title: "Alpha",
      image: "",
      description: "",
      startDate: "2023-01",
      endDate: "2023-06",
      techStack: ["React", "TypeScript"],
    },
    {
      slug: "p2",
      title: "Beta",
      image: "",
      description: "",
      startDate: "2022-01",
      endDate: "2022-12",
      techStack: ["Python"],
    },
    {
      slug: "p3",
      title: "Gamma",
      image: "",
      description: "",
      startDate: "2024-01",
      endDate: "Present",
      techStack: ["React", "Node.js"],
    },
  ]

  describe("filterProjects", () => {
    it("should return all projects when no tech selected", () => {
      expect(filterProjects(projects, [])).toHaveLength(3)
    })

    it("should filter by tech stack membership", () => {
      const result = filterProjects(projects, ["React"])
      expect(result.map(p => p.slug)).toEqual(["p1", "p3"])
    })

    it("should support multiple techs (OR logic)", () => {
      const result = filterProjects(projects, ["React", "Python"])
      expect(result).toHaveLength(3)
    })

    it("should return empty when no match", () => {
      expect(filterProjects(projects, ["Rust"])).toHaveLength(0)
    })
  })

  describe("sortProjects", () => {
    it("should place Present projects first when sorting newest", () => {
      const result = sortProjects(projects, "newest")
      expect(result[0].endDate).toBe("Present")
    })

    it("should sort past projects by end date descending when sorting newest", () => {
      const result = sortProjects(projects, "newest")
      const past = result.filter(p => p.endDate !== "Present")
      expect(past[0].slug).toBe("p1") // 2023-06 > 2022-12
    })

    it("should sort by start date ascending when sorting oldest", () => {
      const result = sortProjects(projects, "oldest")
      expect(result[0].slug).toBe("p2") // 2022-01
    })

    it("should not mutate the original array", () => {
      const original = [...projects]
      sortProjects(projects, "newest")
      expect(projects).toEqual(original)
    })
  })
})

describe("paginateItems", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  it("should return the first page correctly", () => {
    const { items: page, totalPages } = paginateItems(items, 1, 3)
    expect(page).toEqual([1, 2, 3])
    expect(totalPages).toBe(4)
  })

  it("should return a middle page correctly", () => {
    const { items: page } = paginateItems(items, 2, 3)
    expect(page).toEqual([4, 5, 6])
  })

  it("should return a partial last page", () => {
    const { items: page } = paginateItems(items, 4, 3)
    expect(page).toEqual([10])
  })

  it("should compute totalPages correctly", () => {
    expect(paginateItems(items, 1, 5).totalPages).toBe(2)
    expect(paginateItems(items, 1, 10).totalPages).toBe(1)
    expect(paginateItems(items, 1, 3).totalPages).toBe(4)
  })

  it("should return 0 totalPages for an empty array", () => {
    expect(paginateItems([], 1, 5).totalPages).toBe(0)
  })

  it("should return empty items for an out-of-range page", () => {
    const { items: page } = paginateItems(items, 99, 5)
    expect(page).toEqual([])
  })

  it("should work with page size equal to array length", () => {
    const { items: page, totalPages } = paginateItems(items, 1, 10)
    expect(page).toEqual(items)
    expect(totalPages).toBe(1)
  })
})
