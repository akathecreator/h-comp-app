export const sendForMealSuggestions = async (uid: string) => {
  const text_ = `given me weekly meal suggestions`;
  console.log("text_", text_);
  const agentId = process.env.EXPO_PUBLIC_AGENT_ID;
  // const formData = new FormData();
  // formData.append("text", text_);
  // formData.append("userId", uid);
  // formData.append("roomId", `default-room-${agentId}`);
  const payload = {
    text: text_,
    userId: uid,
    roomId: `default-room-${agentId}`,
  };
  try {
    const base = "https://dazzling-simplicity-production.up.railway.app";
    // const base = `http://192.168.1.200:3002`;
    await fetch(`${base}/${agentId}/message`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    // const botResponse = await response.json();
    // return botResponse;
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

export const sendInitialUserData = async (uid: string, data: any) => {
  const text_ =
    "Please save my data as user INITIAL_USER_DATA" + JSON.stringify(data);
  const agentId = process.env.EXPO_PUBLIC_AGENT_ID;
  // const formData = new FormData();
  // console.log("text_", text_);
  // formData.append("text", text_);
  // formData.append("userId", uid);
  // formData.append("roomId", `default-room-${agentId}`);
  const payload = {
    text: text_,
    userId: uid,
    roomId: `default-room-${agentId}`,
  };

  try {
    const base = "https://dazzling-simplicity-production.up.railway.app";
    // const base = `http://192.168.1.200:3002`;
    await fetch(`${base}/${agentId}/message`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    // const botResponse = await response.json();
    // return botResponse;
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

export const sendUserOnboardingConversations = async (uid: string) => {
  const text_ = "TRIGGER_ONBOARDING_CONVERSATION";
  const agentId = process.env.EXPO_PUBLIC_AGENT_ID;
  // const formData = new FormData();
  // console.log("text_", text_);
  // formData.append("text", text_);
  // formData.append("userId", uid);
  // formData.append("roomId", `default-room-${agentId}`);
  const payload = {
    text: text_,
    userId: uid,
    roomId: `default-room-${agentId}`,
  };

  try {
    const base = "https://dazzling-simplicity-production.up.railway.app";
    // const base = `http://192.168.1.200:3002`;
    await fetch(`${base}/${agentId}/message`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    // const botResponse = await response.json();
    // return botResponse;
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};
