import boto3
import mutagen.mp3
import requests
import psycopg2
import mutagen
import csv

public_assets_bucket = "com.mattwyskiel.assets"
new_assets_bucket = "a-list-backend-production-bucket-bbxortox"

db = psycopg2.connect(
    "postgresql://postgres.diikpazixhiuctfgfjtq:Zb7EwXqF5Ak4ygWo@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
)
cur = db.cursor()


s3 = boto3.client("s3")

old_feed = requests.get("https://api.mattwyskiel.com/a-list/").json()

insertables = []

for item in old_feed:
    print(f"Processing {item['slug']}")
    print(f"Downloading {item['audioUrl']}")
    # download file from audio_url
    file = requests.get(item["audioUrl"])
    asset = item["audioUrl"].split("/")[-1]
    with open(asset, "wb") as f:
        f.write(file.content)
        print(f"downloaded {asset} to disk")
        ext = asset.split(".")[-1]
        # print(f"Uploading {asset} to s3 as {item['slug']}.{ext}")
        # s3.copy_object(
        #     Bucket=new_assets_bucket,
        #     Key=f"{item['slug']}.{ext}",
        #     CopySource=f"{public_assets_bucket}/a-list/{asset}",
        # )
        # print(f"Uploaded {item['slug']}.{ext} to s3")
        audio_file = mutagen.mp3.MP3(asset)
        insertables.append(
            {
                "asset_id": 0,
                "mix_id": item["id"],
                "key": f"{item['slug']}.{ext}",
                "mime_type": audio_file.mime[0],
                "duration_seconds": int(audio_file.info.length),
            }
        )

field_names = insertables[0].keys()
with open("insertables.csv", "w") as f:
    writer = csv.DictWriter(f, fieldnames=field_names)
    writer.writeheader()
    writer.writerows(insertables)
