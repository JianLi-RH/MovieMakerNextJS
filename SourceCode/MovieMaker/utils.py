#!/usr/bin/python
import re
import ssl

from moviepy.editor import *

import config_reader
from xunfei_tts import *

import random

def get_random_str(length=8):
    """生成一个随即字符串

    Params:
        length: 字符串长度
    Return:
        随即字符串
    """
    alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890_'
    characters = random.sample(alphabet, length)
    return ''.join(characters)

def get_time(script_time):
    """
    将脚本的时间转换成数字，以秒为单位

    Params:
        script_time: 脚本时间，如: 3秒, 2分5秒, 2 (default is second)

    Return:
        以秒为单位的时间
    """
    if not script_time:
        return 0
    try:
        return float(script_time)
    except ValueError:
        pass

    time_number = 0
    if "分" in script_time:
        _time = script_time.split("分")
        time_number += int(_time[0]) * 60

        if len(_time) > 1:
            script_time = _time[1]

    if "秒" in script_time:
        script_time = script_time.replace("秒", '')
        time_number += float(script_time)

    return time_number

def covert_pos(pos):
    """
    将系统中可能用的位置数据转换为像素值。

    Params:
        pos: 可能的位置数据，如： '中心', [0.1, 0.5], [140, 200], [左侧, 顶侧]
    Return:
        位置的像素值， 标准的最大值是config里的g_width, g_height
    """
    try:
        if not pos:
            return None

        if pos == '中心':
            pos = [0.5, 0.5]

        x_center, y_center = pos
        if x_center == '中心':
            x_center = 0.5
        elif x_center == '左侧':
            x_center = 0
        elif x_center == '右侧':
            x_center = 1

        if y_center == '中心':
            y_center = 0.5
        elif y_center == '顶侧':
            y_center = 0
        elif y_center == '底部':
            y_center = 1

        if x_center <= 1:
            x_center = config_reader.g_width * x_center
        if y_center <= 1:
            y_center = config_reader.g_height * y_center

        return (int(x_center), int(y_center))
    except Exception as e:
        print("不支持的坐标: ", pos)
        raise(e)

def get_audio_length(audio):
    """获取声音长度，单位秒

    Params:
        audio: 声音文件或AudioFileClip实例
    Return:
        声音长度，单位秒
    """
    if not audio:
        return 0
    if isinstance(audio, str):
        return AudioFileClip(audio).duration
    else:
        return audio.duration

def covert_text_to_sound(text, output, output_folder):
    """
    将文字转换成语音

    Params:
        text: 文字
        output: 输出的语音文件
        output_folder: mp3存放路径
    Return:
        语音文件路径
    """
    wsParam = Ws_Param(APPID='',
                    APISecret='',
                    APIKey='',
                    Text=text,
                    output=output,
                    output_folder=output_folder,
                    vcn="鸣泽")
    websocket.enableTrace(False)
    wsUrl = wsParam.create_url()
    ws = websocket.WebSocketApp(wsUrl, on_message=wsParam.on_message, on_error=wsParam.on_error, on_close=wsParam.on_close)
    ws.on_open = wsParam.on_open
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})

    return wsParam.output

def get_sub_title_list(file):
    """根据文本文件生成字幕列表

    Params:
        file: 字幕文件
    Return:
        能被MovieMaker识别的字幕列表
    """

    if os.path.exists(file):
        # 处理字幕文件
        with open(file, 'r') as f:
            text = f.read()
            lines = re.split(r"\,|\.|\?|\;|\!|\，|\。|\？|\！|\t|\n|\r|\s", text)
    else:
        # 以分号分隔的字幕字符串
        lines = file.split(r'\;\s\,')

    basename = os.path.basename(file)
    new_lines = []
    subtitles = []
    for i in range(0, len(lines)):
        if lines[i].strip():
            sound = covert_text_to_sound(lines[i].strip(), f"{i}.mp3", basename)
            new_lines.append(f"- ['', '', '{lines[i].strip()}', '{sound}']\n")
            subtitles.append(['', '', lines[i].strip(), sound])

    new_path = os.path.join(os.path.dirname(file), os.path.basename(file).split('.')[0]+"_sound.txt")
    with open(new_path, 'w') as fn:
        fn.writelines(new_lines)
    print(f"字幕信息已写入文件: {new_path}")
    return subtitles

if __name__ == "__main__":
    # get_sub_title_list("tmp/养生论.txt")
    print(get_random_str(4))
    pass