class MyAwesomeExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
  }

  load() {
    this.viewer.setEnvMapBackground(false);
    this.viewer.impl.renderer().setClearAlpha(0);
    this.viewer.impl.glrenderer().setClearColor(0xffffff, 0);
    this.viewer.impl.invalidate(true);
    this.viewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      ev => {}
    );

    return true;
  }

  unload() {
    return true;
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "MyAwesomeExtension",
  MyAwesomeExtension
);
