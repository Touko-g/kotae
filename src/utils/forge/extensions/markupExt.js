class MarkUp3DExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this.dbIds = [[250], [1354]];
    this.dbId = [];
    this.customize = this.customize.bind(this);
    this.draw = this.draw.bind(this);
    this.updateDiv = this.updateDiv.bind(this);
    this.getModifiedWorldBoundingBox.bind(this);
    this.selectModel = this.selectModel.bind(this);
    this.createBox = this.createBox.bind(this);
    // this.onToolbarCreated=this.onToolbarCreated.bind(this)
    let that = this;
    // this.viewer.container.addEventListener('click', function (ev) {
    //     const result = that.viewer.clientToWorld(ev.clientX, ev.clientY);
    //     // console.log(result)
    //     // const box = document.getElementsByClassName('box')
    //     // box[0].style.left = ev.clientX+44 + 'px';
    //     // box[0].style.top = ev.clientY-188 + 'px'
    //     if (result) {
    //         // console.log(result.point);
    //         const geom = new THREE.SphereGeometry(10, 8, 8);
    //         const material = new THREE.MeshBasicMaterial({color: 0xff0000});
    //         const sphereMesh = new THREE.Mesh(geom, material);
    //         sphereMesh.position.set(result.point.x, result.point.y, result.point.z);
    //         if (!that.viewer.overlays.hasScene('custom-scene')) {
    //             that.viewer.overlays.addScene('custom-scene');
    //         }
    //         that.viewer.overlays.addMesh(sphereMesh, 'custom-scene');
    //
    //         let viewer_pos = that.viewer.container.getBoundingClientRect();
    //
    //         const hitTest = that.viewer.impl.hitTest(result.point.x - viewer_pos.x, result.point.y - viewer_pos.y, true)
    //         // console.log(hitTest)
    //         if (hitTest) {
    //             that.draw({
    //                 x: hitTest.intersectPoint.x,
    //                 y: hitTest.intersectPoint.y,
    //                 z: hitTest.intersectPoint.z
    //             })
    //         }
    //
    //     }
    // });
  }

  load() {
    console.log("MarkUp3DExtension was loaded!");
    this.viewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      this.customize
    );
    return true;
  }

  unload() {
    console.log("unloading");
    this.viewer.removeEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      this.customize
    );
    this.viewer.removeEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      ev => {
        this.updateDiv();
      }
    );
    this.viewer.removeEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      ev => {
        this.selectModel();
      }
    );
    return true;
  }

  customize() {
    for (let i of this.dbIds) {
      this.createBox(i);
    }

    this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, ev => {
      this.updateDiv(this.dbIds);
    });
    this.viewer.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      ev => {
        this.selectModel(ev);
      }
    );
    return true;
  }

  getModifiedWorldBoundingBox(fragIds) {
    //fragments list array
    var fragList = NOP_VIEWER.model.getFragmentList();
    const fragbBox = new THREE.Box3();
    const nodebBox = new THREE.Box3();
    fragIds.forEach(function(fragId) {
      fragList.getWorldBounds(fragId, fragbBox);
      nodebBox.union(fragbBox);
    });

    return nodebBox;
  }

  draw(modelPoint) {
    const box = document.getElementsByClassName("c_box");
    console.log("模型坐标", modelPoint);
    const screePoint = this.viewer.worldToClient(
      new THREE.Vector3(modelPoint.x, modelPoint.y, modelPoint.z)
    );
    console.log("屏幕坐标", screePoint);
    // box[0].style.left = modelPoint.x * (window.innerWidth/2) + 'px';;
    // box[0].style.top = -modelPoint.y * (window.innerHeight/2) + 'px'
  }

  updateDiv(dbIds) {
    const wh = document.getElementById("modelBox");
    const box = document.getElementsByClassName("c_app");

    dbIds.forEach((item, index) => {
      // const pos3 = this.getModifiedWorldBoundingBox(item).center().project(this.viewer.impl.camera)
      const poss = this.viewer.worldToClient(
        this.getModifiedWorldBoundingBox(item).center()
      );
      // const a = window.innerWidth / 2;
      // const b = window.innerHeight / 2;
      // const x = Math.round((pos3.x) * a + a)
      // const y = Math.round((-pos3.y) * b + b)
      box[index + 1].style.left =
        poss.x + wh.getBoundingClientRect().left + "px";
      box[index + 1].style.top = poss.y + "px";
    });

    // 获取 markup 对象。

    // 获取指定的元素的 3D 坐标。
    // console.log(this.getModifiedWorldBoundingBox([174]).center())
    // 把 指定元素的 3D 坐标映射为跟随相机的坐标。
    // const pos3 = this.getModifiedWorldBoundingBox(dbId).center().project(this.viewer.impl.camera)
    // console.log(dbId,pos3)

    //const pos = this.viewer.worldToClient(this.getModifiedWorldBoundingBox([this.id]).center())

    // if (pos3) {
    //     // console.log('change position', pos)
    //     // box[0].style.left = pos.x+ 'px';
    //     // box[0].style.top =  pos.y+ 'px';
    //     // console.log(box[0].style.left,box[0].style.top)
    //     const a = window.innerWidth / 2;
    //     const b = window.innerHeight / 2;
    //     const x = Math.round((pos3.x) * a + a)
    //     const y = Math.round((-pos3.y) * b + b)
    //     box[0].style.left = (x) + 'px';
    //     box[0].style.top = (y - 200) + 'px';
    // }
  }

  selectModel(ev) {
    console.log("选中事件 event: ", ev);
    console.log("选中的 fragIdsArray: ", ev.fragIdsArray);
    const currSelection = this.viewer.getSelection();
    console.log("选中的元素 ", currSelection[0]);
    if (currSelection.length) {
      if (!this.dbIds.flat(Infinity).includes(ev.fragIdsArray[0])) {
        this.dbIds.push(ev.fragIdsArray);
        this.createBox(ev.fragIdsArray);
      }
      this.updateDiv(this.dbIds);
    }
  }

  createBox(boxId) {
    const wh = document.getElementById("modelBox");
    const box = document.getElementsByClassName("c_app");
    const copy = box[0].cloneNode(true);
    document.body.appendChild(copy);
    // const pos = this.getModifiedWorldBoundingBox(boxId).center().project(this.viewer.impl.camera)
    console.log(wh.getBoundingClientRect().left);
    const poss = this.viewer.worldToClient(
      this.getModifiedWorldBoundingBox(boxId).center()
    );
    console.log(poss);
    if (poss) {
      // const a = window.innerWidth / 2;
      // const b = window.innerHeight / 2;
      // const x = Math.round((pos.x) * a + a)
      // const y = Math.round((-pos.y) * b + b)
      copy.style.left = poss.x + wh.getBoundingClientRect().left + "px";
      copy.style.top = poss.y + "px";
      copy.style.display = "block";
      // console.log('复制的元素',copy.childNodes[1].childNodes[1].innerText)
      // copy.childNodes[1].childNodes[1].innerText=boxId
    }
  }

  // onToolbarCreated(toolbar) {
  //     // alert('TODO: customize Viewer toolbar');
  //
  //     const viewer = this.viewer;
  //
  //     // Button 1
  //     const button1 = new Autodesk.Viewing.UI.Button('show-env-bg-button');
  //     button1.onClick=(e)=>{
  //         this.dbIds=[]
  //         const divs=document.querySelectorAll('.app')
  //         divs.forEach((item,index)=>{
  //             if (index===0){
  //
  //             }else {
  //                 item.remove()
  //             }
  //         })
  //         this.updateDiv(this.dbIds)
  //     }
  //     button1.addClass('show-env-bg-button');
  //     button1.setToolTip('Clear ToolTip');
  //     button1.icon.classList.add("fa", "fa-trash");
  //
  //
  //     // SubToolbar
  //     this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-toolbar');
  //     this.subToolbar.addControl(button1);
  //
  //     toolbar.addControl(this.subToolbar);
  // };
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "MarkUp3DExtension",
  MarkUp3DExtension
);
