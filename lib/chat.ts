export const sendForMoreGoals = async (uid: string, type: string) => {
  const text_ = `given me ${type} health quests`;
  const agentId = process.env.EXPO_PUBLIC_AGENT_ID;
  const formData = new FormData();
  formData.append("text", text_);
  formData.append("userId", uid);
  formData.append("roomId", `default-room-${agentId}`);

  try {
    const base = "https://dazzling-simplicity-production.up.railway.app";
    // const base = `http://192.168.1.164:3002`;
    const response = await fetch(`${base}/${agentId}/message`, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    // const botResponse = await response.json();
    // return botResponse;
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

export const sendOnboardingData = async (uid: string, data: any) => {
  const text_ = "sending user ONBOARDING_DATA" + JSON.stringify(data);
  const agentId = process.env.EXPO_PUBLIC_AGENT_ID;
  const formData = new FormData();
  formData.append("text", text_);
  formData.append("userId", uid);
  formData.append("roomId", `default-room-${agentId}`);

  try {
    const base = "https://dazzling-simplicity-production.up.railway.app";
    // const base = `http://192.168.1.164:3002`;
    const response = await fetch(`${base}/${agentId}/message`, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    // const botResponse = await response.json();
    // return botResponse;
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};
