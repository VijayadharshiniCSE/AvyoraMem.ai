import asyncio
from httpx import AsyncClient, ASGITransport
from main import app

async def test_full_pipeline():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/health")
        print("Health check status:", res.status_code, res.json())
        assert res.status_code == 200

        # 2. Presets endpoint
        res = await client.get("/api/presets")
        print("Presets status:", res.status_code, len(res.json()["presets"]), "presets found")
        assert res.status_code == 200

        # 3. Analyze endpoint with preset
        res = await client.post("/api/analyze", data={
            "preset_id": "julian_cyber",
            "query": "Neo-Cyber Tokyo Runway",
            "gender": "Non-Binary / Fluid"
        })
        print("Analyze status:", res.status_code)
        assert res.status_code == 200
        data = res.json()
        print("Visual Profile Extracted:", data["visual_profile"]["skin_tone_name"], data["visual_profile"]["undertone"])
        print("Apparel Headline:", data["styling"]["apparel"]["headline"])
        print("Footwear:", data["styling"]["footwear_accessories"]["footwear"]["name"])
        print("Hair:", data["styling"]["hair_grooming"]["headline"])
        print("Skincare:", data["styling"]["skincare_makeup"]["headline"])

        # 4. Customize endpoint
        res = await client.post("/api/customize", json={
            "current_styling": data["styling"],
            "category": "footwear_accessories",
            "instruction": "Swap to sleek chunky platform boots",
            "visual_profile": data["visual_profile"],
            "gender_expression": "Non-Binary / Fluid"
        })
        print("Customize status:", res.status_code)
        assert res.status_code == 200
        custom_data = res.json()
        print("Updated Footwear:", custom_data["updated_styling"]["footwear_accessories"]["footwear"]["name"])

        # 5. Export Blueprint
        res = await client.post("/api/export-blueprint", json={
            "visual_profile": data["visual_profile"],
            "styling": data["styling"],
            "query": "Neo-Cyber Tokyo Runway",
            "gender": "Non-Binary / Fluid"
        })
        print("Blueprint Export status:", res.status_code, "Length:", len(res.text))
        assert res.status_code == 200
        print("\nALL BACKEND TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
