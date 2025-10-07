from flask import Flask, request, render_template_string
import numpy as np
from PIL import Image
import io, base64
from flask_cors import CORS

from sentinel2_processor import Sentinel2Processor

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET", "POST"])
def index():
    img_tag = ""
    if request.method == "POST":
        red_file = request.files["red"]
        nir_file = request.files["nir"]

        # Simpan sementara
        red_path = "B04.jp2"
        nir_path = "B08.jp2"
        red_file.save(red_path)
        nir_file.save(nir_path)

        # Proses NDVI
        processor = Sentinel2Processor(data_folder=".")
        ndvi_array, profile = processor.calculate_ndvi(red_path, nir_path)
        processor.save_float_ndvi(ndvi_array, profile, "ndvi.tif")

        # Klasifikasi + colormap
        classified_array = processor.classify_ndvi(ndvi_array)
        rgb_preview = processor.apply_colormap(classified_array)

        # Convert ke JPEG untuk preview web
        img = Image.fromarray(rgb_preview)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=80)
        data = base64.b64encode(buf.getvalue()).decode("utf-8")

        # Tampilan hasil + legenda
        img_tag = f"""
        <div class="mt-8 border-t pt-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Hasil NDVI (Klasifikasi Warna)</h2>
          <div class="rounded-lg overflow-hidden border shadow mb-4">
            <img src="data:image/jpeg;base64,{data}" class="w-full"/>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center space-x-2"><span class="w-4 h-4 inline-block rounded-sm" style="background:#DC143C"></span><span>Mati (-1 – 0)</span></div>
            <div class="flex items-center space-x-2"><span class="w-4 h-4 inline-block rounded-sm" style="background:#FFA500"></span><span>Tidak Sehat (0 – 0.33)</span></div>
            <div class="flex items-center space-x-2"><span class="w-4 h-4 inline-block rounded-sm" style="background:#FFFF00"></span><span>Cukup Sehat (0.33 – 0.66)</span></div>
            <div class="flex items-center space-x-2"><span class="w-4 h-4 inline-block rounded-sm" style="background:#228B22"></span><span>Sangat Sehat (0.66 – 1)</span></div>
          </div>
        </div>
        """

    return render_template_string(f"""
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>NDVI Web Prototype</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-100 min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
      
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Upload Sentinel-2 Bands</h1>
      <p class="text-slate-600 mb-6">
        Pilih band <span class="font-semibold">Red (B04)</span> dan 
        <span class="font-semibold">NIR (B08)</span> untuk menghitung NDVI.
      </p>

      <form method="post" enctype="multipart/form-data" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Red (B04.jp2)</label>
          <input type="file" name="red" accept=".jp2" required
            class="w-full text-sm text-slate-600
                   file:mr-3 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"/>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">NIR (B08.jp2)</label>
          <input type="file" name="nir" accept=".jp2" required
            class="w-full text-sm text-slate-600
                   file:mr-3 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"/>
        </div>
        <button type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition-all">
          Proses NDVI
        </button>
      </form>

      {img_tag}
    </div>
  </body>
</html>
    """)


if __name__ == "__main__":
    app.run(debug=True)
