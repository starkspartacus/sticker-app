from PIL import Image

def remove_background(image_path):
    """
    Enlève l'arrière-plan d'une image en utilisant une méthode de segmentation basique.

    :param image_path: Chemin de l'image à traiter
    :return: Image avec l'arrière-plan supprimé
    """
    image = Image.open(image_path).convert("RGBA")
    datas = image.getdata()

    new_data = []
    for item in datas:
        # Change all white (also shades of whites)
        # pixels to transparent
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    image.putdata(new_data)
    return image

def remove_background_from_file(file):
    """
    Enlève l'arrière-plan d'un fichier image et retourne un nouveau fichier image.

    :param file: Fichier image à traiter
    :return: Nouveau fichier image avec l'arrière-plan supprimé
    """
    image = remove_background(file)
    output_path = "/tmp/processed_image.png"
    image.save(output_path)
    return output_path

# Example usage:
# image_path = "path/to/your/image.png"
# result_image = remove_background(image_path)
# if result_image:
#     result_image.show()
#     result_image.save("path/to/save/image_no_bg.png")





