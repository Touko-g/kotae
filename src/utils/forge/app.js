export const setupViewer = (
    divId,
    viewer,
    filePath,
    exrtensionArray,
    ids = {},
    transparent = true
) => {
    const options = {
        env: "AutodeskProduction2",
        api: "streamingV2",
        // language: "zh-cn",
        language: "en",
        getAccessToken: function (onSuccess) {
            const accessToken =
                "eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJjb2RlOmFsbCIsImRhdGE6d3JpdGUiLCJkYXRhOnJlYWQiLCJidWNrZXQ6Y3JlYXRlIiwiYnVja2V0OmRlbGV0ZSIsImJ1Y2tldDpyZWFkIl0sImNsaWVudF9pZCI6Ik5CR0hpRmRTbmh6ZWhleG5kV3Jncjh1bU5VMExMb1JBIiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6ImJ4emdibDVhakt4WVQya0x1N2RIOGRENDhTUG51NEVGTW1YTUx3cUVIa1NtT201OGU5OXZLdEV2MExSWU9ZUmQiLCJleHAiOjE2MzkxMDYyNzF9.Xthk7euiS_J4zibh6mZVABzW8rYh5rZNikR8ySOD0vnye_fFlo3I7OS7pCLgRKcFEsLI-MArw-NB0QcDwcJVAYwQYmoSmiCG6oyY2Lm-KOKqfmJa7IQrE48CBNoD9BnNOG0XeANvMBCpLPSsy-TZ1RbdT4PGorBVYcpIqNN0SRZQbhsnOJojqEB5hGyV2yQWV8KpRozJquiN5vI7PTbj_gonfsF7k0ehLe68jRpEXRxkas7Mw7B-nnm66F7atrvs6UDGrRG34XRDydIQxWeuRA56ztrIAsVcfp9dErbz8hn_osfRgOts4stbmxjKCaSgn-4OPFwOoTexrSujj7gglg";
            const expirationTimeSeconds = 3600;
            onSuccess(accessToken, expirationTimeSeconds);
        }
    };
    const viewConfig = {extensions: exrtensionArray};

    // Forge Viewer 初始化时的回调函数
    const myCallback = function () {
        console.log("初始化成功, 准备创建 Viewer...");

        viewer.value = new Autodesk.Viewing.Viewer3D(divId, viewConfig);

        const startedCode = viewer.value.start();

        if (startedCode > 0) {
            console.error("Failed to create a Viewer: WebGL not supported.");
            return;
        }

        // 模型加载成功后的回调函数。
        function onDocumentLoadSuccess(viewerDocument) {

            viewer.value.navigation.setPosition(new THREE.Vector3(-81368, -58931, 62386))

        }

        // 模型文件加载失败后的回调函数
        function onDocumentLoadFailure() {
            console.error("模型加载失败。未能获取 Forge manifest.");
        }

        viewer.value.loadModel(
            filePath,
            ids,
            onDocumentLoadSuccess,
            onDocumentLoadFailure
        );
    };
    Autodesk.Viewing.Initializer(options, myCallback);
    Autodesk.Viewing.Private.InitParametersSetting.alpha = transparent;
};
