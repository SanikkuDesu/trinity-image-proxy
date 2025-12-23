export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Get the URL from the ?url= parameter
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response("IF YOU SEE THIS THE PAGE IS WORKING AS INTENDED. Missing 'url' parameter. Usage: ?url=IMAGE_URL", { status: 400 });
    }

    try {
      console.log(`Fetching: ${targetUrl}`);

      // 2. Download the image from Roblox/Internet
      const imageResponse = await fetch(targetUrl);
      
      if (!imageResponse.ok) {
        return new Response(`Failed to fetch image lol. Status: ${imageResponse.status}`, { status: 500 });
      }

      // 3. Convert raw image data to Base64
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      // 4. Return PLAIN TEXT (Base64) so Roblox can read it
      return new Response(base64String, {
        headers: { 
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*" // Good for debugging
        },
      });

    } catch (err) {
      return new Response("Worker Error: " + err.message, { status: 500 });
    }
  },
};
