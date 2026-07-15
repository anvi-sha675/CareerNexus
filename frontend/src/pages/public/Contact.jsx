import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin } from "lucide-react";
import Card from "../../components/common/Card";
import TextField from "../../components/forms/TextField";
import TextareaField from "../../components/forms/TextareaField";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";
import { isEmail } from "../../utils/validators";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "hello@careernexus.io" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "Office", value: "Bengaluru, India" },
];

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    reset();
    showToast(
      "Thanks for reaching out — we'll reply within one business day.",
      { type: "success", title: "Message sent" },
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Get in touch
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Questions about CareerNexus? We'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {CONTACT_INFO.map((info) => (
            <Card key={info.label} className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
                <info.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{info.label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {info.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Full name"
                required
                error={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />
              <TextField
                label="Email address"
                type="email"
                required
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  validate: (v) => isEmail(v) || "Enter a valid email",
                })}
              />
            </div>
            <TextField
              label="Subject"
              required
              error={errors.subject?.message}
              {...register("subject", { required: "Subject is required" })}
            />
            <TextareaField
              label="Message"
              required
              rows={5}
              error={errors.message?.message}
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Please share a bit more detail",
                },
              })}
            />
            <Button type="submit" loading={submitting}>
              Send message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
