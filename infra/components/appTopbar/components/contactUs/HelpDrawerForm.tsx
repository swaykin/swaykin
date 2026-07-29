"use client";

import { useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { FormControl } from "@/infra/baseweb/FormControl";
import { Input } from "@/infra/baseweb/Input";
import { Textarea } from "@/infra/baseweb/Textarea";

type HelpDrawerFormProps = {
  onSubmit: (subject: string, description: string) => void;
};

const LABEL_CLASS_NAME = "text-[14px] font-semibold text-text";

export const HelpDrawerForm = ({ onSubmit }: HelpDrawerFormProps) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = subject.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(subject, description);
    setSubject("");
    setDescription("");
  };

  return (
    <Box className="flex flex-1 flex-col">
      <FormControl label="Subject" required className={LABEL_CLASS_NAME}>
        <Input
          size="compact"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can we help?"
        />
      </FormControl>
      <FormControl
        label="Tell us more about what we can help you with"
        required
        className={LABEL_CLASS_NAME}
      >
        <Textarea
          size="compact"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your case…"
          overrides={{
            Input: { style: { minHeight: "160px" } },
          }}
        />
      </FormControl>
      <Box className="-mx-5 border-t border-border mt-auto flex px-5 py-3 justify-end">
        <Button
          size="small"
          kind="primary"
          disabled={!canSubmit}
          onClick={handleSubmit}
          overrides={{
            BaseButton: { style: { width: "80px" } },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
