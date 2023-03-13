class TurnTableExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this.customize = this.customize.bind(this);
    this.setToolbar = this.setToolbar.bind(this);
    this.onExtensionLoaded = this.onExtensionLoaded.bind(this);
    this.setBackground = this.setBackground.bind(this);
  }

  load() {
    this.viewer.addEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      this.customize
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
      this.setToolbar
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      this.onExtensionLoaded
    );
    this.viewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      this.setBackground
    );

    return true;
  }

  unload() {
    return true;
  }

  customize() {
    this.viewer.removeEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      this.customize
    );
    //Start coding here ...

    let viewer = this.viewer;
    // viewer.navigation.setPosition(new THREE.Vector3(-135, -4160, 80))
    // viewer.navigation.setPosition(new THREE.Vector3(742, -87, 238))
  }

  setToolbar() {
    const toolbar = this.viewer.toolbar;

    toolbar.removeControl("modelTools");

    const navTool = toolbar.getControl("navTools");

    navTool.setVisible(false);
    // console.log(navTool)
    // navTool.removeControl("toolbar-cameraSubmenuTool")
    // toolbar.removeControl("navTools")

    toolbar.removeControl("settingsTools");
  }
  onExtensionLoaded(e) {
    if (e.extensionId === "Autodesk.BimWalk") {
      const navTools = this.viewer.toolbar.getControl("navTools");

      navTools.removeControl("toolbar-bimWalkTool");
      this.viewer.removeEventListener(
        Autodesk.Viewing.EXTENSION_LOADED_EVENT,
        this.onExtensionLoaded
      );
    }
  }
  setBackground() {
    this.viewer.setBackgroundColor(0, 0, 0, 0, 0, 0);
    this.viewer.impl.setDoubleSided(true, this.viewer.model);
    // this.viewer.setLightPreset(1);
    // this.viewer.setQualityLevel(false, false);
    // this.viewer.setGhosting(true);
    // this.viewer.setGroundShadow(false);
    // this.viewer.setGroundReflection(false);
    // this.viewer.setEnvMapBackground(false);
    // this.viewer.setProgressiveRendering(true);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "TurnTable",
  TurnTableExtension
);
