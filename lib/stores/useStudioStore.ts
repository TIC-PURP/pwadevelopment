import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface StudioComponent {
  id: string
  type: "text" | "input" | "button" | "container"
  props: Record<string, any>
  x: number
  y: number
  width: number
  height: number
  children?: StudioComponent[]
}

export interface StudioPage {
  id: string
  name: string
  slug: string
  components: StudioComponent[]
  createdAt: string
  updatedAt: string
}

interface StudioState {
  // Current design state
  components: StudioComponent[]
  selectedComponent: string | null
  isPreviewMode: boolean
  canvasSize: { width: number; height: number }

  // Page management
  currentPage: StudioPage | null
  savedPages: StudioPage[]

  // UI state
  showPropertyEditor: boolean
  draggedComponent: StudioComponent | null

  // Actions - Component management
  addComponent: (component: Omit<StudioComponent, "id">) => void
  updateComponent: (id: string, updates: Partial<StudioComponent>) => void
  deleteComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  moveComponent: (id: string, x: number, y: number) => void
  resizeComponent: (id: string, width: number, height: number) => void
  duplicateComponent: (id: string) => void

  // Actions - Page management
  createNewPage: (name: string, slug: string) => void
  loadPage: (pageId: string) => void
  savePage: () => void
  deletePage: (pageId: string) => void
  exportPage: () => string
  importPage: (jsonData: string) => void

  // Actions - UI state
  setPreviewMode: (preview: boolean) => void
  setShowPropertyEditor: (show: boolean) => void
  clearCanvas: () => void

  // Actions - Utility
  generateId: () => string
  validateComponent: (component: StudioComponent) => boolean
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      // Initial state
      components: [],
      selectedComponent: null,
      isPreviewMode: false,
      canvasSize: { width: 1200, height: 800 },
      currentPage: null,
      savedPages: [],
      showPropertyEditor: false,
      draggedComponent: null,

      // Component management
      addComponent: (componentData) => {
        const id = get().generateId()
        const newComponent: StudioComponent = {
          ...componentData,
          id,
        }

        if (get().validateComponent(newComponent)) {
          set((state) => ({
            components: [...state.components, newComponent],
            selectedComponent: id,
            showPropertyEditor: true,
          }))
        }
      },

      updateComponent: (id, updates) => {
        set((state) => ({
          components: state.components.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)),
        }))
      },

      deleteComponent: (id) => {
        set((state) => ({
          components: state.components.filter((comp) => comp.id !== id),
          selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
          showPropertyEditor: state.selectedComponent === id ? false : state.showPropertyEditor,
        }))
      },

      selectComponent: (id) => {
        set({
          selectedComponent: id,
          showPropertyEditor: id !== null,
        })
      },

      moveComponent: (id, x, y) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id ? { ...comp, x: Math.max(0, x), y: Math.max(0, y) } : comp,
          ),
        }))
      },

      resizeComponent: (id, width, height) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id ? { ...comp, width: Math.max(50, width), height: Math.max(30, height) } : comp,
          ),
        }))
      },

      duplicateComponent: (id) => {
        const component = get().components.find((c) => c.id === id)
        if (component) {
          const newId = get().generateId()
          const duplicated: StudioComponent = {
            ...component,
            id: newId,
            x: component.x + 20,
            y: component.y + 20,
          }

          set((state) => ({
            components: [...state.components, duplicated],
            selectedComponent: newId,
          }))
        }
      },

      // Page management
      createNewPage: (name, slug) => {
        const newPage: StudioPage = {
          id: get().generateId(),
          name,
          slug,
          components: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          currentPage: newPage,
          savedPages: [...state.savedPages, newPage],
          components: [],
          selectedComponent: null,
          showPropertyEditor: false,
        }))
      },

      loadPage: (pageId) => {
        const page = get().savedPages.find((p) => p.id === pageId)
        if (page) {
          set({
            currentPage: page,
            components: [...page.components],
            selectedComponent: null,
            showPropertyEditor: false,
            isPreviewMode: false,
          })
        }
      },

      savePage: () => {
        const { currentPage, components } = get()
        if (currentPage) {
          const updatedPage = {
            ...currentPage,
            components: [...components],
            updatedAt: new Date().toISOString(),
          }

          set((state) => ({
            currentPage: updatedPage,
            savedPages: state.savedPages.map((p) => (p.id === updatedPage.id ? updatedPage : p)),
          }))
        }
      },

      deletePage: (pageId) => {
        set((state) => ({
          savedPages: state.savedPages.filter((p) => p.id !== pageId),
          currentPage: state.currentPage?.id === pageId ? null : state.currentPage,
          components: state.currentPage?.id === pageId ? [] : state.components,
        }))
      },

      exportPage: () => {
        const { currentPage, components } = get()
        const exportData = {
          page: currentPage,
          components,
          exportedAt: new Date().toISOString(),
        }
        return JSON.stringify(exportData, null, 2)
      },

      importPage: (jsonData) => {
        try {
          const parsed = JSON.parse(jsonData)
          if (parsed.page && parsed.components) {
            const importedPage: StudioPage = {
              ...parsed.page,
              id: get().generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            set((state) => ({
              currentPage: importedPage,
              savedPages: [...state.savedPages, importedPage],
              components: parsed.components.map((comp: StudioComponent) => ({
                ...comp,
                id: get().generateId(),
              })),
              selectedComponent: null,
              showPropertyEditor: false,
            }))
          }
        } catch (error) {
          console.error("Error importing page:", error)
          throw new Error("Invalid JSON format")
        }
      },

      // UI state
      setPreviewMode: (preview) => {
        set({
          isPreviewMode: preview,
          selectedComponent: null,
          showPropertyEditor: false,
        })
      },

      setShowPropertyEditor: (show) => {
        set({ showPropertyEditor: show })
      },

      clearCanvas: () => {
        set({
          components: [],
          selectedComponent: null,
          showPropertyEditor: false,
        })
      },

      // Utility functions
      generateId: () => {
        return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },

      validateComponent: (component) => {
        if (!component.type || !component.id) return false
        if (component.x < 0 || component.y < 0) return false
        if (component.width < 50 || component.height < 30) return false
        return true
      },
    }),
    {
      name: "purp-studio-storage",
      partialize: (state) => ({
        savedPages: state.savedPages,
        currentPage: state.currentPage,
        components: state.components,
      }),
    },
  ),
)
