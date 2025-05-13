
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "react": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild__react__prebuild__.js")
          return pkg
        }
      ,
        "antd": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild__antd__prebuild__.js")
          return pkg
        }
      ,
        "react-redux": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild__react_mf_2_redux__prebuild__.js")
          return pkg
        }
      ,
        "@reduxjs/toolkit": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild___mf_0_reduxjs_mf_1_toolkit__prebuild__.js")
          return pkg
        }
      ,
        "@xyflow/react": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild___mf_0_xyflow_mf_1_react__prebuild__.js")
          return pkg
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild__react_mf_2_dom__prebuild__.js")
          return pkg
        }
      ,
        "jsonata": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild__jsonata__prebuild__.js")
          return pkg
        }
      ,
        "dayjs": async () => {
          let pkg = await import("__mf__virtual/ContactX_mf_2_Flow_mf_2_Editor__prebuild__dayjs__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "react": {
            name: "react",
            version: "19.1.0",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=18.0.0"
            }
          }
        ,
          "antd": {
            name: "antd",
            version: "5.24.7",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["antd"].loaded = true
              const {"antd": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=5.0.0"
            }
          }
        ,
          "react-redux": {
            name: "react-redux",
            version: "9.2.0",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["react-redux"].loaded = true
              const {"react-redux": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=8.0.0"
            }
          }
        ,
          "@reduxjs/toolkit": {
            name: "@reduxjs/toolkit",
            version: "2.7.0",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["@reduxjs/toolkit"].loaded = true
              const {"@reduxjs/toolkit": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=1.9.0"
            }
          }
        ,
          "@xyflow/react": {
            name: "@xyflow/react",
            version: "12.5.6",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["@xyflow/react"].loaded = true
              const {"@xyflow/react": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=1.0.0"
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "19.1.0",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=18.0.0"
            }
          }
        ,
          "jsonata": {
            name: "jsonata",
            version: "2.0.6",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["jsonata"].loaded = true
              const {"jsonata": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=1.8.5"
            }
          }
        ,
          "dayjs": {
            name: "dayjs",
            version: "1.11.13",
            scope: ["default"],
            loaded: false,
            from: "ContactX-Flow-Editor",
            async get () {
              usedShared["dayjs"].loaded = true
              const {"dayjs": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: ">=1.10.0"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      