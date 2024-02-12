3. 动作
   1. 动作是最细小的活动，不能再进一步拆分了
   2. MovieMaker提供了一下动作可以用于视频制作：
       1. 显示：
            1. 用于显示某个角色
            2. yaml文件格式如下
            ```
                -
                  名称: 显示
                  角色: 摩托车
            ```
       2. 消失
            1. 用于隐藏某个角色
            2. yaml文件格式如下
            ```
                -
                  名称: 消失
                  角色: 摩托车
            ```
        3. 镜头
           1. 用于控制镜头拉近拉远、焦点的切换
           2. yaml文件格式如下
            ```
                -
                  名称: 镜头
                  焦点: ["中心", "底部"]
                  变化: [1, 0.7]
            ```
            3. 其中`焦点`可以是字符串，如"中心"
                也可以是包含两个值的数组，如[0.1, 0.5], [140, 200], [左侧, 顶侧]  
                如果是数组的话，第一个值代表横坐标的位置，第二个值代表纵坐标的位置  
                当数组的值小于等于1大于等于0的时候，表示百分比，如0.1代表10%  
                当数组的值大于1的时候代表实际的像素位置  
                还可以用文字表示，其中横坐标的可选值包括`中心`, `左侧`, `右侧`, 总坐标的可选值包括`中心`, `顶侧`, `底部`
            4. `变化`用于生成镜头拉近拉远的效果
               1. 变化是一个包含两个值的数组，第一个值是变化前的百分比，第二个值是变化后的百分比
               2. 变化只能是百分比形式，即0到1之间的小数  

            **同一个活动中只能有一个`镜头`动作**
        4. 行进
           1. 行进就是控制角色移动
           2. yaml文件格式如下
            ```
                -
                  名称: 行进
                  角色: 沙雕
                  开始位置: [0.8, 0.2] # 左上角
                  结束位置: [0.2, 0.2]
                  比例: [0.06, 0.15]  # 比例变化，开始比例 - 结束比例
                  方式: 旋转
            ```
            3. `开始位置`表示角色行进开始前的位置，如果想继续上一次动作，则可以不填写开始位置
            4. `结束位置`是角色行进结束的位置
            5. `比例`是角色行进前后的显示比例的变化，是一个包含两个比例信息的数组
               1. 可以是百分比，例如[0.06, 0.15]
               2. 也可以是具体像素值，例如[(100,120), (100,120)]
               3. 如果想继续之前的动作，则可以给数组的第一个值留空, 例如['', (100,120)]
            6. `方式`是角色行进的方式，目前支持"自然"和"旋转"两种
        5. 转身
           1. 让角色转动，如左右转身，上下翻转，指定角度翻转
           2. yaml文件格式如下
            ```
                -
                  名称: 转身
                  角色: 沙雕
                  度数: 左右 # 左右, 上下， 45(逆时针角度)
            ```
            3. `度数`是角色旋转的角度，可以是`左右`, `上下`， 也可以是具体度数，如45、30
         6. gif
            1. 向视频中插入一段gif
            2. yaml文件格式如下
            ```
                -
                    名称: gif # 向视频中插入一个gif
                    素材: resources/SuCai/watermark.gif
                    位置: [0.48, 0]
                    比例: 0.7
                    度数: 左右 # 左右, 上下， 45(逆时针角度)
            ```
            3. 素材: gif文件路径
            4. 位置： gif文件在视频中的显示位置
            5. 比例： gif的显示比例，目前只支持百分比形式