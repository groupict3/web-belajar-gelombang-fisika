from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)     # supaya frontend dari port 5500 bisa kirim data ke backend

# halaman utama
@app.route('/')
def home():
    return "Backend berjalan dengan benar! Kamu bisa buka frontend di Live Server."

# endpoint menerima audio
@app.route('/process-audio', methods=['POST'])
def process_audio():
    try:
        data = request.get_json()

        # ambil data audio dari frontend
        pcm_data = data.get("data", [])
        if not pcm_data:
            return jsonify({"error": "Audio tidak diterima"}), 400

        # ubah list js menjadi numpy array
        audio_array = np.array(pcm_data)

        # hitung amplitude rata-rata
        amplitude = float(np.mean(np.abs(audio_array)))

        # kirim balik hasil ke website frontend
        return jsonify({
            "status": "ok",
            "amplitude": amplitude
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("Backend berjalan di http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)
