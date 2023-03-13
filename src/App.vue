<template>
  <v-app>
    <router-view></router-view>
    <snackbar/>
    <div class="name w-100 h-100 d-flex justify-center align-center" v-if="route.path==='/'" @click="jump">
      <TransitionGroup @enter="onEnter" @leave="onLeave" :css="false">
        <!--        <span class="name" @click="jump" v-if="flag">Kotae</span>-->
        <span v-for="(i,k) in name" :data-index="k" v-if="flag">{{ i }}</span>
      </TransitionGroup>
    </div>
    <fab :show="scrollTop>1000"/>
  </v-app>
</template>

<script setup lang="ts">
import Snackbar from '@/components/Snackbar/index.vue'
import Fab from '@/components/Fab/index'
// import {getFragId, getAllDbId, getChildren, getNodeName, getDetailDbId} from "@/utils/forge/utils/tools";
// import * as MyAwesomeExtension from "@/utils/forge/extensions/backgroud";
// import * as SelectModel from "@/utils/forge/extensions/selectModel";
// import * as TurnTable from "@/utils/forge/extensions/camareRotate";
// import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import anime from "animejs";
import {onMounted, provide, ref} from "vue";

const router = useRouter()
const route = useRoute()

const flag = ref(false)
const clickFlag = ref(false)
const name = 'Kotae'
const mode = ref(true)

const scrollTop = ref(0)

provide('mode', mode)
const onEnter = (el: any, done: any) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: [100, 0],
    easing: 'easeOutElastic',
    delay: el.dataset.index * 100,
    duration: 1200,
    complete: done,
  })
}
const onLeave = (el: any, done: any) => {
  anime({
    targets: el,
    opacity: [1, 0],
    translateY: [0, -100],
    duration: 1000,
    easing: 'easeOutElastic',
    delay: (5 - el.dataset.index + 1) * 100, //
    complete: done,
  })
}

const jump = () => {
  if (clickFlag.value) {
    flag.value = false
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }
}

onMounted(() => {
  flag.value = true
  setTimeout(() => {
    clickFlag.value = true
  }, 1400)
  window.addEventListener('scroll', e => {
    scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop;
  })
})
// let viewer = null
// const position = ref(null)
// const diff = ref(0)
// let flag = ref(0)
// const data = [
//   {
//     id: 19,
//     name: 'box001',
//     position: 'right',
//     fragId: [],
//     total: 10,
//     count: 0,
//     anima: null
//   },
//   {
//     id: 17,
//     name: 'box002',
//     position: 'left',
//     fragId: [],
//     total: 10,
//     count: 0,
//     anima: null
//   },
//   {
//     id: 13,
//     name: 'box004',
//     position: 'left',
//     fragId: [],
//     total: 20,
//     count: 0,
//     anima: null
//   },
//   {
//     id: 11,
//     name: 'box005',
//     position: 'left',
//     fragId: [],
//     total: 20,
//     count: 0,
//     anima: null
//   },
//   {
//     id: 9,
//     name: 'box006',
//     position: 'left',
//     fragId: [],
//     total: 20,
//     count: 0,
//     anima: null
//   },
//   {
//     id: 7,
//     name: 'box007',
//     position: 'left',
//     fragId: [],
//     total: 10,
//     count: 0,
//     anima: null
//   },
// ]
//
// watch(flag, value => {
//   if (value === 6) {
//     setTimeout(() => {
//       router.push('/login')
//     }, 500)
//   }
// })
//
// const render = () => {
//   for (let i of data) {
//     const refresh = () => {
//       for (let j of i.fragId) {
//         diff.value = i.total - i.count
//         let fragProxy = viewer.impl.getFragmentProxy(viewer.model, j);
//         fragProxy.getAnimTransform();
//         switch (true) {
//           case diff.value > 0 :
//             if (i.position === 'right') {
//               fragProxy.position.x += -0.1
//             } else {
//               fragProxy.position.x += 0.1
//             }
//             i.count += 0.1
//             break;
//           default:
//             break
//         }
//         fragProxy.updateAnimTransform();
//       }
//       if (diff.value > 0) {
//         i.anima = requestAnimationFrame(refresh);
//         viewer.impl.sceneUpdated(true);
//       } else {
//         cancelAnimationFrame(i.anima);
//         flag.value += 1
//       }
//     }
//     refresh()
//   }
// }
//
// const initModel = () => {
//   const modelBox = document.getElementById("model");
//   const options = {
//     env: "AutodeskProduction2",
//     api: "streamingV2",
//     // language: "zh-cn",
//     language: "en",
//     getAccessToken: function (onSuccess) {
//       const accessToken =
//           "eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJjb2RlOmFsbCIsImRhdGE6d3JpdGUiLCJkYXRhOnJlYWQiLCJidWNrZXQ6Y3JlYXRlIiwiYnVja2V0OmRlbGV0ZSIsImJ1Y2tldDpyZWFkIl0sImNsaWVudF9pZCI6Ik5CR0hpRmRTbmh6ZWhleG5kV3Jncjh1bU5VMExMb1JBIiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6ImJ4emdibDVhakt4WVQya0x1N2RIOGRENDhTUG51NEVGTW1YTUx3cUVIa1NtT201OGU5OXZLdEV2MExSWU9ZUmQiLCJleHAiOjE2MzkxMDYyNzF9.Xthk7euiS_J4zibh6mZVABzW8rYh5rZNikR8ySOD0vnye_fFlo3I7OS7pCLgRKcFEsLI-MArw-NB0QcDwcJVAYwQYmoSmiCG6oyY2Lm-KOKqfmJa7IQrE48CBNoD9BnNOG0XeANvMBCpLPSsy-TZ1RbdT4PGorBVYcpIqNN0SRZQbhsnOJojqEB5hGyV2yQWV8KpRozJquiN5vI7PTbj_gonfsF7k0ehLe68jRpEXRxkas7Mw7B-nnm66F7atrvs6UDGrRG34XRDydIQxWeuRA56ztrIAsVcfp9dErbz8hn_osfRgOts4stbmxjKCaSgn-4OPFwOoTexrSujj7gglg";
//       const expirationTimeSeconds = 3600;
//       onSuccess(accessToken, expirationTimeSeconds);
//     }
//   };
//   const viewConfig = {extensions: ["TurnTable", "MyAwesomeExtension", "SelectModel"]};
//
//   const myCallback = () => {
//     viewer = new Autodesk.Viewing.Viewer3D(modelBox, viewConfig);
//
//     const startedCode = viewer.start();
//
//     if (startedCode > 0) {
//       console.error("Failed to create a Viewer: WebGL not supported.");
//       return;
//     }
//
//     // 模型加载成功后的回调函数。
//     function onDocumentLoadSuccess(viewerDocument) {
//       viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT,
//           (ev) => {
//
//           }
//       )
//       viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, e => {
//         render()
//         // router.push('/login')
//       })
//       viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, e => {
//         viewer.navigation.setPosition(
//             new THREE.Vector3(-16, 118, 6)
//         );
//       })
//       viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, async e => {
//         viewer.fitToView();
//         // viewer.setQualityLevel(true, true);
//         // viewer.setProgressiveRendering(false);
//         for (let [i, v] of data.entries()) {
//           const res = await getChildren(viewer, v.id)
//           const frags = await getFragId(viewer, res)
//           data[i].fragId.push(frags)
//         }
//       })
//     }
//
//     // 模型文件加载失败后的回调函数
//     function onDocumentLoadFailure() {
//       console.error("模型加载失败。未能获取 Forge manifest.");
//     }
//
//     viewer.loadModel(
//         'https://chen-1302611521.cos.ap-nanjing.myqcloud.com/model/question/question.svf',
//         {},
//         onDocumentLoadSuccess,
//         onDocumentLoadFailure
//     );
//   }
//   Autodesk.Viewing.Initializer(options, myCallback);
//   Autodesk.Viewing.Private.InitParametersSetting.alpha = true;
// }
// onMounted(() => {
//   if (route.path === '/'){
//     initModel()
//   }
// })
</script>
<style>

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.adsk-viewing-viewer {
  background: none !important
}

.name {
  font-size: 100px;
  font-weight: bold;
  font-style: italic;
  text-shadow: 3px 3px 2px #03DAC6;
  animation: shadow 5s linear infinite;
}

@keyframes shadow {
  0% {
    text-shadow: 3px 3px 2px #2196F3;
  }
  25% {
    text-shadow: 3px 3px 2px #349d17;
  }
  50% {
    text-shadow: 3px 3px 2px #835656;
  }
  75% {
    text-shadow: 3px 3px 2px #00ee53;
  }
  100% {
    text-shadow: 3px 3px 2px #2196F3;
  }
}
</style>
