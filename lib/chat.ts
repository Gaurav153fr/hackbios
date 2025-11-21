import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
export const runtime = 'edge';
// Load your API key securely
const MY_GEMINI_API_KEY = "AIzaSyDNKkIPOi0WRJMqeCRFm16YB4sN8czr1kg"

// Create a custom Google Generative AI instance
const google = createGoogleGenerativeAI({
  apiKey: MY_GEMINI_API_KEY,
});

/**
 * Generates responses from the AI assistant for your import/export marketplace.
 * The assistant only provides information about tariffs, deals, rules, shipping, customs, etc.
 * It never gives personal advice or unrelated content.
 *
 * @param userQuery The user's question or prompt
 * @returns {Promise<string>} AI-generated assistant response
 */
const getAssistantResponse = async (userQuery: string): Promise<any> => { // Use 'any' here or the specific AI SDK type
  try {
    const systemPrompt = `...`; // (System prompt remains the same)

    const result = await streamText({
      model: google('gemini-2.5-flash'), 
      // Use 'messages' for better context handling, even if it's just one turn
      messages: [ 
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ],
      maxOutputTokens: 1024,
    });

    // 🌟 FIX/CONFIRMATION: Correctly return the AsyncIterableStream
    return result.textStream; 

  } catch (error) {
    console.error("Error generating assistant response:", error);
    // Returning the string allows the client's type-narrowing logic to catch it.
    return "Sorry, I couldn't fetch the information. Please try again later.";
  }
};

// NOTE: This is a crucial placeholder utility. In a real application, 
// this function MUST fetch the image from the URL and convert its 
// binary data into a Base64 string, encapsulated in a Part object 
// (e.g., { inlineData: { data: 'BASE64_STRING', mimeType: 'image/jpeg' } }).

interface Base64ImagePart {
  /** The raw Base64 string of the image data. */
  base64Data: string;
  /** The MIME type of the image (e.g., 'image/jpeg', 'image/png'). */
  mimeType: string;
}
const getProductDataByImage = async (image: Base64ImagePart) => {
try {
  // 1. **System Prompt (Role and Constraints)**
  const systemPrompt = `
    You are an expert AI Product Cataloging Agent. Your task is to analyze product images and 
    generate precise, structured inventory data for an e-commerce database.
    
    Objective:
    Upon receiving an image of a product, you must identify the item with high accuracy and 
    return a JSON object populated with the specific fields defined below.
    
    Field Extraction & Logic Guidelines:
    name (String): Identify the Brand, Model, and Color. Format: "[Brand] [Model] [Key Feature] - [Color]". 
    (e.g., "boAt Airdopes 131 True Wireless Earbuds - Active Black").
    
    userId (String): Return the placeholder value "user_upload_default".
    
    price (Number): Estimate the current market price for a brand-new unit. 
    Return the raw number (no currency symbols). If the brand is Indian, estimate in INR; 
    otherwise, estimate in USD.
    
    description (String): Generate a professional, SEO-friendly product description (40-60 words). 
    Mention key visible features and probable technical specs.
    
    min_order_quantity (Number): Default to 1 unless the product appears to be a bulk/wholesale item.
    
    hsn_code (String): Determine the accurate 4 to 8-digit Harmonized System (HSN) code based on the 
    product category (e.g., 85183000).
    
    condition (Enum: "new" | "used" | "refurbished"): 
    - If high-quality, white-background stock image, set to "new".
    - If casual photo with visible wear/background clutter, set to "used".
    
    category (String): Classify into one of these categories based on appearance:
     "Electronics",
    "Textiles & Apparel",
    "Machinery & Equipment",
    "Raw Materials",
    "Chemicals & Polymers",
    "Automotive Parts",
    "Furniture",
    "Agricultural Products",
    "Metals & Alloys",
    "Other",
    
    preference (Enum: "private" | "selected_countries" | "public"): Default to "public".
    
    prefered_countries (Array of Strings): Infer based on the brand's primary market. 
    If global, use ["Global"]. If specific (like boAt), use ["India"].
    
    total_quantity (Number): Set a logical placeholder value of 50.
    
    Output Constraints:
    1. Return ONLY the raw JSON object.
    2. Do not include markdown code blocks (\`\`\`json), explanations, or conversational filler.
    3. Ensure all data types match the schema exactly.
    
    Example Output Structure (Mandatory Schema):
    {
    "name": "...",
    "userId": "...",
    "price": 000,
    "description": "...",
    "min_order_quantity": 1,
    "hsn_code": "...",
    "condition": "new",
    "category": "...",
    "preference": "public",
    "prefered_countries": ["..."],
    "total_quantity": 50
    }
  `;

  // 2. **Convert the image URL to a format the API can process (Multimodal Part)**
 
  const imagePart = {
    type: 'image',
    image: Buffer.from(image.base64Data, 'base64'), // The 'image' field expects a Buffer or Uint8Array
    mimeType: image.mimeType,
  };
  // 3. **API Call with Multimodal Input**
  const { text } = await generateText({
    model: google('gemini-2.5-flash'), 
   messages:[
    { role: 'system', content: systemPrompt },
      {role: 'user', content:[{type:"image", image:imagePart.image}] }
   ],
  
  });
  
  // The returned 'text' should be the raw JSON object.
  console.log("text response from Gemini:", text);
  
  return text;

} catch (error) {
  console.error("Error generating product data from image:", error);
  return error;
}
};
export { getAssistantResponse,getProductDataByImage };
