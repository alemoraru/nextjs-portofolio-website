import { describe, it, expect } from "vitest"
import { cn, formatDuration, calculateDuration, normalizeTechName } from "@/lib/utils"

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
