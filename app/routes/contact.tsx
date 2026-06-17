import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useRef, useState } from "react";
import { mergeMeta } from "~/lib/meta-utils";
import { Text } from "~/components/misc/text";
import { PageHeader } from "~/components/misc/page-header";
import { LinkedInSvg } from "~/components/svgs/LinkedInSvg";
import GithubSvg from "~/components/svgs/GithubSvg";
import { useAction } from "~/hooks/use-action";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { contactFormActionDefinition } from "~/lib/actions/contact-form/action-definition";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = ({ matches }) =>
  mergeMeta(matches, [
    { title: "Contact | Ben Honda" },
    { name: "description", content: "Get in touch with Ben Honda – Software Engineer." },
    { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/contact" },
    { property: "og:title", content: "Contact | Ben Honda" },
    { property: "og:description", content: "Get in touch with Ben Honda – Software Engineer." },
    { property: "og:url", content: "https://www.bhonda.com/contact" },
  ]);

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

// Wire the route to the action framework so the contact form can POST here.
export const action = action_handler;

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);

  const contactForm = useAction(contactFormActionDefinition, {
    onSuccess: () => {
      formRef.current?.reset();
      setSent(true);
    },
    toastOnSuccess: { message: "Thanks! Your message has been sent." },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    contactForm.submit({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""), // honeypot
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative size-40 shrink-0">
            <img
              src="/images/ben-1-expanded-tight.png"
              alt="Ben Honda"
              className="size-40 rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full bg-yellow-200/30 mix-blend-multiply" />
          </div>
          <Text as="h2" variant="heading-md">
            Contact
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <a
            href="https://www.linkedin.com/in/benhonda/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <LinkedInSvg className="w-6 h-6 shrink-0" />
            <Text as="span" variant="body">
              linkedin.com/in/benhonda
            </Text>
          </a>

          <a
            href="https://github.com/benhonda"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <GithubSvg className="w-6 h-6 shrink-0" />
            <Text as="span" variant="body">
              github.com/benhonda
            </Text>
          </a>
        </div>

        {/* Contact form */}
        <div className="mt-10 max-w-2xl">
          <Text as="h3" variant="heading-sm" className="mb-4">
            Send me a message
          </Text>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" name="name" type="text" required maxLength={100} autoComplete="name" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} />
            </div>

            {/* Honeypot — visually hidden, off-screen; real users never fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={contactForm.isValidating}>
                {contactForm.isValidating ? "Sending…" : "Send message"}
              </Button>
              {sent && (
                <Text as="span" variant="body" className="text-muted-foreground">
                  Message sent — thanks for reaching out!
                </Text>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
