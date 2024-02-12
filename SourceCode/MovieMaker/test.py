#!/usr/bin/python
from libs import ImageHelper


# images = ["resources/SuCai/武松/说话/1.png", "resources/SuCai/武松/说话/2.png"]
# images = ["resources/SuCai/武松/店小二/image-removebg-preview (2).png", "resources/SuCai/武松/店小二/image-removebg-preview.png"]
# images = ["resources/SuCai/武松/喝酒1.png", "resources/SuCai/武松/喝酒2.png", "resources/SuCai/武松/喝酒3.png"]
# gif = ImageHelper.create_gif(images)
# print(gif)

img = 'output/太空0.jpg'
ImageHelper.add_text_to_image(img, '哈哈哈', overwrite_image=False)

# ImageHelper.get_frames_from_gif("resources/SuCai/武松/喝酒.gif")