"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@components/Form";

const UpdatePrompt = () => {
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  const PromptDetails = () => {
    const searchParams = useSearchParams();
    const promptId = searchParams.get("id");

    useEffect(() => {
      const getPromptDetails = async () => {
        if (!promptId) return;

        try {
          const response = await fetch(`/api/prompt/${promptId}`);
          const data = await response.json();

          setPost({
            prompt: data.prompt,
            tag: data.tag,
          });
        } catch (error) {
          console.error("Error fetching prompt details:", error);
        }
      };

      getPromptDetails();
    }, [promptId]);

    return null;
  };

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const searchParams = useSearchParams();
    const promptId = searchParams.get("id");

    if (!promptId) {
      alert("Missing PromptId!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to update prompt");
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptDetails />
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
      />
    </Suspense>
  );
};

export default UpdatePrompt;
