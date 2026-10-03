import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site stores when you sign in, and how to delete it.",
  alternates: { canonical: "/privacy" },
};

const contactEmail = "jarvisbrendanj@gmail.com";

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-6 lg:py-10">
      <div className="space-y-2">
        <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">
          Privacy
        </h1>
        <p className="text-muted-foreground">Last updated 3 October 2026</p>
      </div>

      <p>
        This is Brendan Jarvis&apos;s personal website. You can read everything
        on it without an account. Signing in is only needed to leave a comment
        on a blog post.
      </p>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          What is stored when you sign in
        </h2>
        <p>
          You can sign in with GitHub or Google. When you do, the site stores:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            your name, email address, and profile picture URL, as shared by
            GitHub or Google
          </li>
          <li>
            which provider you used and your account ID with that provider,
            along with the tokens the provider returns at sign-in
          </li>
          <li>a session record, so you stay signed in, with its expiry date</li>
          <li>
            any comments you post, with your name, user ID, and the time you
            posted or edited them
          </li>
        </ul>
        <p>
          The site does not ask GitHub or Google for anything beyond your basic
          profile and email address.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Cookies</h2>
        <p>
          Signing in sets cookies that keep your session and protect the sign-in
          form. The site does not use advertising or analytics cookies.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Where it is stored
        </h2>
        <p>
          Account, session, and comment data is stored in a{" "}
          <Link
            href="https://supabase.com/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Supabase
          </Link>{" "}
          Postgres database in Sydney, Australia. The site is hosted on{" "}
          <Link
            href="https://vercel.com/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Vercel
          </Link>
          , which processes request data such as your IP address to serve pages.
        </p>
        <p>
          Your data is used only to run sign-in and comments. It is not sold or
          used for marketing.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Deleting your data
        </h2>
        <p>
          Email{" "}
          <a href={`mailto:${contactEmail}`} className="underline">
            {contactEmail}
          </a>{" "}
          from the address on your account and ask for your data to be deleted.
          Your account, linked sign-in providers, sessions, and comments will be
          removed. You can also revoke this site&apos;s access at any time in
          your GitHub or Google account settings.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
        <p>
          Questions about this page:{" "}
          <a href={`mailto:${contactEmail}`} className="underline">
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
