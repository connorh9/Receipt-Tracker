import openai
import cv2
import pytesseract
from dotenv import load_dotenv, find_dotenv
import os
import numpy as np
import json

load_dotenv()
#api_key = os.getenv("openai_key")

client = openai.OpenAI(
    api_key=os.getenv("openai_key"),
)

def extract_text(file):
    """
    Extracts the image from the input and transforms it and
    produces a string representation of the image.
    Returns: string: the receipt's text in string format
    """
    #print(pytesseract)
    #img = cv2.imread("../walmart_receipt.png")
    
    #Here we decode the image we received as a file buffer
    file_bytes = file.read()
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    #resize_img = cv2.resize(img, (300, 300), interpolation=cv2.INTER_AREA)
    
    # grayscale to make text stand out
    grayscale_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    #created more contrast in image
    contrasted_img = cv2.addWeighted(grayscale_img, 2, grayscale_img, -1, 0)
    # remove any noise that may affect the text reading
    reduced_noise = cv2.fastNlMeansDenoising(contrasted_img,None,30,7,21)
    #apply otsu's threshold to make everything either black or white
    ret, thresh_img = cv2.threshold(reduced_noise, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY)
    # rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    # dilation = cv2.dilate(thresh_img, rect_kernel, iterations = 1)

    #writing the image for testing
    cv2.imwrite("test_receipt.jpg", thresh_img)

    #use tesseract for text extraction
    text = pytesseract.image_to_string(thresh_img)
    print(text)
    return text

def get_formatted_json(text):
    prompt = """You are a receipt parser AI. I will give you raw text extracted from an image of a store receipt. I want you to return a JSON object of that text and
    include a field named expense_type where you infer what type of expense it is and categorize it based on the receipt. The JSON stucture should be: 
    {"total", "business", "items": [{"title", "quantity", "price"}], "timestamp", "expense_type}. The prices should be integers representing the number of pennies,
    ($1 = 100), make sure you scan and find the total. Normalize the timestamp to be YYYY-MM-DD HH:MM with that in 24 hour time, if timestamp not present set it to current time. 
    Only return the JSON object to me. Here is the extracted text from the receipt: """ + text

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role":"user",
                "content": prompt
            }
        ],
        response_format={"type":"json_object"}
    )

    return json.loads(response.choices[0].message.content)


if __name__ == "__main__":
    #path = input("Enter image path: ")
    raw_text = extract_text()
    #json_data = get_formatted_json(raw_text)
    #print(json_data)