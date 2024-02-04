# from langchain.chats import OpenAIChat
import os
import requests
from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS
from youtube_transcript_api.formatters import MyCustomFormatter
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import (
    HumanMessage,
)
from langchain.prompts import PromptTemplate, FewShotPromptTemplate
from langchain.prompts.example_selector import LengthBasedExampleSelector
from example import examples

app = Flask(__name__)

CORS(app)  
api_key = os.getenv("OPENAI_API_KEY")

selected_model="gpt-3.5-turbo"


@app.route('/transcript', methods=['GET'])
def summary_api():
    print (request.args)
    url = request.args.get('url', '')
    video_id = url.split('=')[0]
    transcript = get_transcript(video_id)
    return jsonify({'transcript': transcript}), 200

def get_transcript(video_id):
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id,languages=['en', 'hi'])
    # transcript = ''
    # # print(transcript_list)
    # for segment in transcript_list:
    
    #     start_time = segment['start']
    
    #     transcript += f"[{start_time}] {segment['text']}\n\n"
    # print(transcript)
    
    formatter = MyCustomFormatter()

    formatted_text = formatter.format_transcript(transcript_list)

    return formatted_text




@app.route('/summary',methods=['POST'])

def generate_response():
    
    if not request.is_json:
        return jsonify({'error': 'Request bosy must be JSON'}), 400
    content = request.json 
    if not content or 'transcripts' not in content:
        return jsonify({'error': 'Missing transcripts data'}), 400
    formatted_text = content['transcripts']

    chat = ChatOpenAI(
        temperature=0.7,
        model=selected_model,
        openai_api_key=api_key,
    )
    formatted_template = '''{example_query} {example_response}'''
    prompt_tmplt = PromptTemplate(
        input_variables=["example_query", "example_response"],
        template=formatted_template,
    )
    prompt_selector = LengthBasedExampleSelector(
        examples=examples,
        example_prompt=prompt_tmplt,
        max_length=42
    )

    dynamic_prompt = FewShotPromptTemplate(
        example_selector=prompt_selector,
        example_prompt=prompt_tmplt,
        prefix="""Summarize the following transcript of a youtube video. Include all key points, and make it detailed,
        Your output should use the following template:
        • Summary
        • Notes
            - [Emoji] Bulletpoint
        
        
        You have been tasked with creating a concise summary of a YouTube video using its transcription to supply college student notes to use himself. You are to act like an expert in the subject the transcription is written about.
        Make a summary of the transcript. 
        Create 10 bullet points (each with an appropriate emoji) that summarize the key points or important moments from the video's transcription.
        You are also a transcription AI and you have been provided with transcription of the video that may contain captions with timestamps of the video. Your task is to summarize the video.
        Please ensure that the summary, bullet points, and explanations fit within the 330-word limit, while still offering a comprehensive and clear understanding of the video's content. Use the text at top of every response: (Title) (Transcript).
        """,
        suffix="Here is your summary...\n\n{input}\n",
        input_variables=["input"],
        example_separator="\n\n",
    )
    final_prompt = dynamic_prompt.format(input=f'{formatted_text}')

    resp = chat([HumanMessage(content=final_prompt)])
    print(resp.content)
    return jsonify({'summary': resp.content})

# def format_time(seconds):
#     minutes = int(seconds // 60)
#     seconds = int(seconds % 60)
#     return f"{str(minutes).zfill(2)}:{str(seconds).zfill(2)}"
# def get_summary(transcript):
#     summariser = pipeline('summarization')
#     summary = ''
#     for i in range(0, (len(transcript)//1000)+1):
#         summary_text = summariser(transcript[i*1000:(i+1)*1000])[0]['summary_text']
#         summary = summary + summary_text + ' '
#     return summary

# python environment 
# .\venv\Scripts\activate

# Open Router Key :
# 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
#curl -X POST http://localhost:5000/summary -H "Content-Type: application/json" -d '{"transcripts": "Hey who are you"}'


if __name__ == '__main__':
    app.run(debug=True)


