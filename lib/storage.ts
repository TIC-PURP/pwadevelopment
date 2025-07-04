// Simple localStorage wrapper for consistency
const storage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error("Error getting item from storage:", error)
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error("Error setting item in storage:", error)
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing item from storage:", error)
    }
  },
}

export default storage
