class SelectModel extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.onSelectionBinded = this.onSelectionEvent.bind(this);
        this.getModifiedWorldBoundingBox = this.getModifiedWorldBoundingBox.bind(
            this
        );
        this.change = this.change.bind(this);
    }

    load() {
        this.viewer.addEventListener(
            Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            this.onSelectionBinded
        );
        // this.viewer.addEventListener(Autodesk.Viewing.CAMERA_TRANSITION_COMPLETED,this.change);
        return true;
    }

    unload() {
        return true;
    }

    getModifiedWorldBoundingBox(fragIds) {
        //fragments list array
        const fragList = this.viewer.model.getFragmentList();
        const fragbBox = new THREE.Box3();
        const nodebBox = new THREE.Box3();
        fragIds.forEach(function (fragId) {
            fragList.getWorldBounds(fragId, fragbBox);
            nodebBox.union(fragbBox);
        });
        return nodebBox;
    }

    onSelectionEvent(ev) {
        const currSelection = this.viewer.getSelection();
        // console.log(this.viewer);
        // this.viewer.fitToView(currSelection);
        // console.log(ev)
    }

    change() {
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
    "SelectModel",
    SelectModel
);
