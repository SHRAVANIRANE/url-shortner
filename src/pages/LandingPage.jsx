import React, { useState } from "react";
// Import Button, Input, Accordion components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import useNavigate to enable routing
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  // Store the long URL that the user enters
  const [longUrl, setLongUrl] = useState("");

  // Hook to perform routing
  const navigate = useNavigate();

  // This function runs when we submit the form
  const handleshorten = (e) => {
    e.preventDefault();

    // If a URL is entered, we move to another page with it
    if (longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <h1 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl  text-center font-bold">
        Make URLs <br />
        Shorter right here!
      </h1>

      {/* Form for entering long URL */}
      <form
        onSubmit={handleshorten}
        action=""
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      >
        {/* Input box for long URL */}
        <Input
          type="url"
          value={longUrl}
          placeholder="Enter your loooong URL"
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />

        {/* Button to shorten */}
        <Button type="submit" className="h-full" variant="destructive">
          Shorten!
        </Button>
      </form>

      {/* Banner image */}
      <img
        src="/src/assets/banner1.jpg"
        alt="banner"
        className="w-full my-11 md:px-11"
      />

      {/* FAQ section with accordion */}
      <Accordion type="multiple" collapsible className="w-full md:p-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Trimmer URL Shortener work?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              It converts a long URL into a short and more manageable link. When
              you enter a long URL, it generates a unique short URL that
              redirects to the original link when clicked. This is useful for
              sharing links on social media, in emails, or anywhere you need a
              concise URL.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
          <AccordionContent>
            <p>
              Yes — it's needed to track your URLs’ usage and for customization.
              Creating an account allows you to manage your shortened URLs, view
              analytics, and access additional features like custom aliases
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Can I customize the shortened URL?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Yes — you can customize it with a custom alias or keyword. This
              feature allows you to create memorable and branded links that are
              easier to share and recognize.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
