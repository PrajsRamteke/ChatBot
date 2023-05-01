/** @format */

// Select DOM elements
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chat = document.getElementById("chat");

// Add event listener to form submission
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from submitting

  // Get message input value
  const message = messageInput.value;
  //api key
  const api_key = "Enter Your api key here";
  // Append user's message to chat
  const userMessageElement = document.createElement("div");
  userMessageElement.classList.add(
    "p-2",
    "my-2",
    "rounded-md",
    "bg-gray-100",
    "ml-auto",
    "max-w-xs"
  );
  userMessageElement.textContent = message;
  chat.appendChild(userMessageElement);
  // Clear input field
  messageInput.value = "";
  // Add loading text
  const loadingText = document.createElement("div");
  loadingText.classList.add(
    "p-2",
    "my-2",
    "rounded-md",
    "bg-gray-300",
    "text-gray-700",
    "mr-auto",
    "max-w-xs"
  );
  loadingText.textContent = "Loading...";
  chat.appendChild(loadingText);
  // Generate response using OpenAI API
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
        max_tokens: 3999,
        n: 1,
        // stop: "\n",
        temperature: 0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
      }
    );
    // Remove loading text
    chat.removeChild(loadingText);
    // Append bot's response to chat
    const botMessageElement = document.createElement("div");
    botMessageElement.classList.add(
      "p-2",
      "my-2",
      "rounded-md",
      "bg-gray-500",
      "text-white",
      "mr-auto",
      "max-w-xs"
    );
    botMessageElement.innerText = response.data.choices[0].message.content;
    chat.appendChild(botMessageElement);

    // Add copy button to message element
    const copyButton = document.createElement("button");
    copyButton.classList.add(
      "ml-2",
      "text-white-500",
      "rounded",
      "bg-green-500",
      "px-2",
      "py-1",
      "text-xs"
    );
    copyButton.innerText = "Copy";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(botMessageElement.innerText);
      copyButton.innerText = "Copied!";
      setTimeout(() => {
        copyButton.innerText = "Copy";
      }, 2000);
    });
    botMessageElement.appendChild(copyButton);
  } catch (error) {
    console.log(`An error occurred during the HTTP request: ${error} papii`);
    // Remove loading text
    chat.removeChild(loadingText);
  }
});
