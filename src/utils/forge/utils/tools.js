/**
 * forge - 获取节点边界框
 * @param {object} viewer viewer 实例
 * @param {number[]} fragIds 片段Id
 */
export const getModifiedWorldBoundingBox = (viewer, fragIds) => {
    const fragList = viewer.model.getFragmentList();
    const fragBox = new THREE.Box3();
    const nodeBox = new THREE.Box3();
    fragIds.forEach(fragId => {
        fragList.getWorldBounds(fragId, fragBox);
        nodeBox.union(fragBox);
    });
    return nodeBox;
};

/**
 * forge - 获取所有dbId
 * @param {object} viewer viewer 实例
 * @returns {number[]}
 */
export const getAllDbId = viewer => {
    const instanceTree = viewer.model.getData().instanceTree;
    let allDbIds = Object.keys(instanceTree.nodeAccess.names);
    let dbIds = [];
    let dbIdsInfo = {};
    allDbIds.forEach(item => {
        dbIds.push(parseInt(item));
        dbIdsInfo[item] = instanceTree.getNodeName(item);
    });
    // console.log("dbIdsInfo", dbIdsInfo);
    return dbIds;

    // const allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex) || [];
    // return allDbIdsStr.map(id => {
    //     return parseInt(id);
    // });
};

/**
 * forge - 获取节点名称
 * @param {object} viewer viewer 实例
 * @param {number} dbId dbId
 * @returns {string|undefined}
 */
export const getNodeName = (viewer, dbId) => {
    return viewer.model.getData().instanceTree.getNodeName(dbId);
};

/**
 * forge - 根据categories获取包含对应名称的dbId数组的对象
 * @param {object} viewer viewer 实例
 * @param {string[]} categories 分类名称数组
 * @returns {object}
 */
export const getDetailDbId = (viewer, categories = []) => {
    return getAllDbId(viewer).reduce((acc, cur) => {
        const name = getNodeName(viewer, cur);
        for (let i of categories) {
            if (name) {
                if (name.startsWith(i)) {
                    acc[i] = [...(acc[i] || []), cur];
                }
            }
        }
        return acc;
    }, {});
};

/**
 * 设置相同大小
 * @param {string} className 需要被设置相同大小的类名
 * @returns {ResizeObserver}
 */
export const setResize = (className) => {
    return new ResizeObserver(function (entries) {
        const entry = entries[0];
        const cr = entry.contentRect;
        const canvasBox = document.getElementsByClassName(className);
        canvasBox[0].style.width = cr.width + "px";
        canvasBox[0].style.height = cr.height + "px";
    });
};

/**
 * forge - 放大缩小视角，会卡顿
 * @param {object} viewer viewer 实例
 * @param {number} num 放大缩小倍数
 */
export const zoom = (viewer, num) => {
    const nav = viewer.navigation;
    const pos = nav.getPosition();
    const target = nav.getTarget();
    const viewdir = new THREE.Vector3();
    viewdir.subVectors(pos, target).normalize();
    viewdir.multiplyScalar(num);
    pos.add(viewdir);
    nav.setPosition(pos);
};

// export const zoom1 = (viewer, num) => {
//     let camera = this.viewer3D.getCamera();
//     viewer.fitToView(dbIds, null, true); //provide your device id to locate
//     var direction = new THREE.Vector3();
//     camera.getWorldDirection(direction);
//     //set distance move the camera forward to your needs (gives value in minus for zoomout)
//     camera.position.add(direction.multiplyScalar(-15));
//     let fov = viewer.navigation.getVerticalFov();  //or horizontalFov
//     viewer.navigation.setRequestTransition(true, camera.position, viewer.navigation.getTarget(), fov); //if not work then try fov + 20,30,40 etc..
// }

/**
 * forge - 根据dbId获取fragId
 * @param {object} viewer viewer 实例
 * @param {number} dbId
 * @returns {Promise<unknown>}
 */
export const getFragId = (viewer, dbId) => {
    return new Promise((resolve, reject) => {
        const tree = viewer.model.getData().instanceTree;
        //遍历此对象含有的fragment id
        tree.enumNodeFragments(
            dbId,
            fragId => {
                resolve(fragId);
            },
            false
        );
    });
};
/**
 * 获取子节点
 * @param viewer
 * @param dbId
 * @param recursive 是否字节点也执行
 * @returns {Promise<unknown>}
 */
export const getChildren = (viewer, dbId, recursive = false) => {
    let val = null
    recursive && (val = [])
    return new Promise(resolve => {
        const tree = viewer.model.getData().instanceTree;
        tree.enumNodeChildren(dbId, fragId => {
            recursive ? val.push(fragId) : resolve(fragId)
        }, recursive)
        resolve(val)
    })
}


/**
 * forge - 克隆节点
 * @param boxId
 * @param {object} viewer viewer 实例
 */
export const createBox = (boxId, viewer) => {
    const wh = document.getElementById("modelBox");
    const box = document.getElementsByClassName("c_app");
    const copy = box[0].cloneNode(true);
    document.body.appendChild(copy);
    const poss = viewer.worldToClient(
        getModifiedWorldBoundingBox(viewer, boxId).center()
    );
    if (poss) {
        copy.style.left = poss.x + wh.getBoundingClientRect().left + "px";
        copy.style.top = poss.y + "px";
        copy.style.display = "block";
    }
};

/**
 * forge - 更新dom元素屏幕坐标
 * @param {Array.<number[]>} dbIds dom元素需要跟随的dbId
 * @param {object} viewer viewer 实例
 * @param {string} ele 需要跟随移动元素的类名
 * @param {string} modelId 包裹model的外层容器
 */
export const updateDiv = (dbIds = [], viewer, ele, modelId) => {
    const wh = document.getElementById(modelId).getBoundingClientRect();
    const box = document.getElementsByClassName(ele);
    dbIds.length &&
    dbIds.forEach((item, index) => {
        const allPoint = getModifiedWorldBoundingBox(viewer, item);
        const center = getModifiedWorldBoundingBox(viewer, item).center();
        const pos = new THREE.Vector3(center.x, center.y, allPoint.max.z);
        const poss = viewer.worldToClient(pos);
        if (box.length && box[index]) {
            box[index].style.left = poss.x + wh.left + "px";
            box[index].style.top = poss.y - 190 + wh.top + "px";
        }
    });
};

/**
 * forge - 当前viewer中的模型z轴旋转
 * @param {object} viewer viewer 实例
 */
export const rotateCamera = viewer => {
    const nav = viewer.navigation;
    const axis = new THREE.Vector3(0, 0, 1);
    const speed = Math.PI / 180;
    const matrix = new THREE.Matrix4();
    matrix.makeRotationAxis(axis, speed);

    let pos = nav.getPosition();
    const up = nav.getCameraUpVector();
    pos.applyMatrix4(matrix);
    up.applyMatrix4(matrix);
    nav.setView(pos, new THREE.Vector3(0, 0, 0));
    nav.setCameraUpVector(up);
    requestAnimationFrame(rotateCamera);
};

/**
 * forge - 根据dbId进行隔离
 * @param {object} viewer viewer 实例
 * @param {number[]} dbId 需要隔离的dbId数组
 * @param {number[]} colorDbId 需要单独设置虚化颜色的dbId数组
 * @param {boolean} dbColor 是否对需要隔离的dbId数组设置颜色
 * @param {Array} color 颜色数组 new THREE.Vector4参数范围:0-1,color[0]:隔离的dbId,color[1]:单独设置虚化颜色的dbId,color[2]:其他所有虚化的颜色
 */
export const isolate = (
    viewer,
    dbId = [],
    colorDbId = [],
    dbColor = false,
    color = [
        new THREE.Vector4(236 / 255, 204 / 255, 104 / 255, 1),
        new THREE.Vector4(46 / 255, 204 / 255, 113 / 255, 1),
        new THREE.Vector4(112 / 255, 161 / 255, 1, 1)
    ]
) => {

    const tree = viewer.model.getData().instanceTree

    if (dbId.length) {
        viewer.isolate(dbId);
        viewer.setGhosting(true);
        const arr = viewer.getIsolatedNodes()

        viewer.clearThemingColors();

        const res = getAllDbId(viewer).filter(dbId => !arr.includes(dbId));

        dbColor && dbId.forEach(item => {
            viewer.setThemingColor(item, color[0]);
        });

        res.forEach(item => {
            if (colorDbId.includes(item)) {
                tree.enumNodeChildren(item, (e) => {
                    viewer.setThemingColor(e, color[1])
                }, false)
            } else {
                tree.enumNodeChildren(item, (e) => {
                    viewer.setThemingColor(e, color[2])
                }, false)
            }
        });
    }
};

/**
 * forge - 取消隔离,并去除所有设置的颜色
 * @param {object} viewer viewer 实例
 */
export const resetIsolate = viewer => {
    viewer.clearThemingColors();
    viewer.isolate([]);
};

/**
 * forge - 销毁查看器实例
 * @param {object} viewer viewer 实例
 */
export const destroyViewer = viewer => {
    if (viewer) {
        viewer.finish();
        viewer = null;
        // Autodesk.Viewing.shutdown();
    }
};

/**
 * 模型移动在一条线
 * @param {Array} moves 模型移动的一些参数...
 * @param {object} viewer viewer 实例
 * @param {any} anima 用于接受requestAnimationFrame的返回值，以便取消动画
 */
export const lineMoves = (moves, viewer, anima) => {
    moves.forEach(item => {
        if (item.flag) {
            item.frags.forEach(fragId => {
                let fragProxy = viewer.impl.getFragmentProxy(viewer.model, fragId);
                fragProxy.getAnimTransform();

                const num = random(0, 100)
                num > 10 ? fragProxy.position.z += item.speed : fragProxy.position.z -= item.speed

                item.count += item.speed
                fragProxy.updateAnimTransform();
            })
        }
    })
    anima = requestAnimationFrame(() => {
        lineMoves(moves, viewer, anima)
    });
    viewer.impl.sceneUpdated(true);
}
/**
 * 模型旋转
 * @param {object} ROTATE 模型旋转的一些参数...
 * @param {object} viewer viewer 实例
 * @param {any} anima 用于接受requestAnimationFrame的返回值，以便取消动画
 */
export const modelRotates = (ROTATE, viewer, anima) => {
    if (ROTATE.flag) {
        ROTATE.frags.forEach((fragId, index) => {
            let quaternion = new THREE.Quaternion()
            quaternion.setFromAxisAngle(new THREE.Vector3(ROTATE.axis[index].x, ROTATE.axis[index].y, ROTATE.axis[index].z), (ROTATE.right[index] ? Math.PI : -Math.PI) / 50)
            let fragProxy = viewer.impl.getFragmentProxy(viewer.model, fragId);
            fragProxy.getAnimTransform();

            let position = new THREE.Vector3(fragProxy.position.x - ROTATE.center[index].x, fragProxy.position.y - ROTATE.center[index].y, fragProxy.position.z - ROTATE.center[index].z)
            position.applyQuaternion(quaternion)
            position.add(ROTATE.center[index])
            fragProxy.position = position

            fragProxy.quaternion.multiplyQuaternions(quaternion, fragProxy.quaternion)
            fragProxy.updateAnimTransform();
        });
        anima = requestAnimationFrame(() => {
            modelRotates(ROTATE, viewer, anima)
        });
        viewer.impl.sceneUpdated(true);
    }
}


/**
 * 获取模型路径
 * @param {number} id 项目Id
 * @param {string} key 路径后缀
 * @returns {*|string}
 */
export const getModelPath = (id, key) => {
    return (
        id &&
        key &&
        `https://cabrenergy-v2-1255710621.cos.ap-beijing.myqcloud.com/bim/${id}/${key}.svf`
    );
};

/**
 * 设置line材质
 * @param color
 * @param opacity
 * @returns {*}
 */
export const createMaterial = (color = 0x000000, opacity = 1.0) => {
    return new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        depthWrite: false,
        depthTest: true,
        linewidth: 10,
        opacity
    });
};

/**
 * forge - 给模型添加边界框
 * @param {object} viewer viewer 实例
 * @param {number[]} fragIds 需要添加边界框模型的片段Id数组
 */
export const drawBox = (viewer, fragIds = [0]) => {
    const bbox = getModifiedWorldBoundingBox(viewer, fragIds);

    const geometry = new THREE.Geometry();

    const {min, max} = bbox;

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z));
    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z));

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z));
    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z));

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z));
    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z));

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z));
    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z));

    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z));
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z));

    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z));
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z));

    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z));
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z));

    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z));
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z));

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z));
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z));

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z));
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z));

    geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z));
    geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z));

    geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z));
    geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z));

    const lines = new THREE.Line(
        geometry,
        createMaterial(0x0000ff),
        THREE.LinePieces
    );

    viewer.impl.createOverlayScene("boundingBox", createMaterial(0x0000ff));

    viewer.impl.addOverlay("boundingBox", lines);

    viewer.impl.invalidate(true, true, true);
};

/**
 * forge - 获取叶节点
 * @param {object}model viewer实例下的model
 * @param {number[]=}dbIds 隔离的dbId
 * @returns {Promise<unknown>}
 */
export const getLeafNodes = (model, dbIds) => {
    return new Promise((resolve, reject) => {
        try {
            const instanceTree = model.getData().instanceTree;

            dbIds = dbIds || instanceTree.getRootId();

            const dbIdArray = Array.isArray(dbIds) ? dbIds : [dbIds];

            let leafIds = [];

            const getLeafNodesRec = id => {
                let childCount = 0;

                instanceTree.enumNodeChildren(id, childId => {
                    getLeafNodesRec(childId);

                    ++childCount;
                });

                if (childCount === 0) {
                    leafIds.push(id);
                }
            };

            for (let i = 0; i < dbIdArray.length; ++i) {
                getLeafNodesRec(dbIdArray[i]);
            }

            return resolve(leafIds);
        } catch (ex) {
            return reject(ex);
        }
    });
};
/**
 * forge - 完全隔离,不产生虚化效果,但轴点仍处于整个模型上
 * @param {object} viewer viewer 实例
 * @param {object}model viewer实例下的model
 * @param {number[]}dbIds 隔离的dbId
 * @returns {Promise<unknown>}
 */
export const isolateFull = (viewer, model = null, dbIds = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            model = model || viewer.model;

            viewer.isolate(dbIds);

            const targetIds = Array.isArray(dbIds) ? dbIds : [dbIds];

            const targetLeafIds = await getLeafNodes(model, targetIds);

            const leafIds = await getLeafNodes(model);

            const leafTasks = leafIds.map(dbId => {
                return new Promise(resolveLeaf => {
                    const show =
                        !targetLeafIds.length || targetLeafIds.indexOf(dbId) > -1;

                    viewer.impl.visibilityManager.setNodeOff(dbId, !show);

                    resolveLeaf();
                });
            });

            return Promise.all(leafTasks);
        } catch (ex) {
            return reject(ex);
        }
    });
};

export const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};