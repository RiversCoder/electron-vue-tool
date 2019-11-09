function MainListener(electron){
    const { dialog, ipcMain } = electron;

    // 监听是否需要打开选择文件夹
    ipcMain.on('open-directory-dialog', function (event, p) {
      dialog.showOpenDialog({
        properties: [p]
      },function (files) {
         console.log(files)
          if (files){// 如果有选中
            // 发送选择的对象给子进程
            event.sender.send('selectedItem', files[0]);
            return;
          }
      })
    });

}

export default MainListener;