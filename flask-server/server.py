from flask import Flask, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/call', methods=['POST'])
def handle_request():
    # Ensure the file exists in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    api_name = request.form.get('api_name')  # 'api_name' should be part of the form data

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the file or process it as needed
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Here, you can do something with api_name and the file
    print(f'API Name: {api_name}')
    print(f'File saved at: {file_path}')

    return jsonify({
        'message': 'File uploaded and processed successfully',
        'filename': file.filename,
        'api_name': api_name
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
