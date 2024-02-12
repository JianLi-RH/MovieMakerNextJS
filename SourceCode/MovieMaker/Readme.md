
程序入口： run.py

Prerequests:
https://imagemagick.org/script/download.php
https://imagemagick.org/script/install-source.php
https://crotoc.github.io/2018/09/28/Install-customized-fonts-for-imagemagick/#Install-customized-fonts-for-imagemagick

imagemagick的bug:
/home/jianl/.local/lib/python/site-packages/moviepy/video/io/ffmpeg_reader.py # 259
infos = error.decode("utf-8", errors="ignore")


免费字体： https://www.fonts.net.cn/fonts-zh-1.html
文字转语音： https://voicemaker.in/

其他素材下载：
https://huaban.com/pins/4661349227/similar/materials
https://www.cgjoy.com/thread-205265-1-1.html

https://github.com/Zulko/moviepy/blob/master/Dockerfile


在线生成图片：
  https://www.doutub.com/picEdit  # 合成图片
  https://www.aigei.com/bgremover # 背景变透明
  https://www.remove.bg/zh/upload # 背景变透明
  https://memes.tw/maker/painter/10274
沙雕生成器
  https://www.bilibili.com/video/BV1344y1m7fw/
生成熊猫举牌：http://c.tianhezulin.com/cx3/2825/
合并图片： https://www.media.io/image-converter/merge-png.html


# 字幕说明： 开始时间，结束时间，文字， 语音，角色名， 角色动作
# 示例
['','', '小二', 'resources/ShengYin/武松/酒馆里/小二.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']

例子：
场景: # 每个场景共用一套角色和背景，不同的场景使用不同的角色和背景
  -
    背景: resources/JiChuSuCai/BeiJing/1.jpg
    角色:
      -
        名字: 摩托车
        素材: resources/JiChuSuCai/JiaoTongGongJu/MoTuoChe/1.png
      -
        名字: 沙雕
        素材: resources/SuCai/JueSe/人物24.png
    活动:
      -
        名字: "1"
        描述: 人物出场
        背景音乐: resources/ShengYin/a.mp3
        字幕: 字幕文件.txt
        持续时间: 3秒
        动作:
          -
            名称: 行进
            角色: 摩托车
            开始位置: [0.1, 0.6] # 左上角
            结束位置: [0.8, 0.4]
            比例: [0.1, 0.06]  # 比例变化，开始比例 - 结束比例
            方式: 自然 #跳跃、旋转
      -
        名字: "2"
        描述: 镜头拉近
        背景音乐: resources/ShengYin/打招呼.mp3
        字幕: 
          - [0,1, '你好啊']
          - [1,'', '我是沙雕']
        持续时间: 2秒
        动作:
          -
            名称: 消失
            角色: 摩托车
          -
            名称: 转身
            角色: 沙雕
            度数: 左右 # 左右, 上下， 45(逆时针角度)
          -
            名称: 镜头
            焦点: ["中心", "底部"]
            变化: [1, 0.7]  # 画面从100%显示，到70%显示，即将镜头拉近到70%
          -
            名称: gif # 向视频中插入一个gif
            素材: resources/SuCai/watermark.gif
            位置: [0.48, 0]
            比例: 0.7
            度数: 左右 # 左右, 上下， 45(逆时针角度)