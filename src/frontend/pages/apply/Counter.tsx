import { useState, type FormEvent } from "react";
import { GovukButton } from "../../components/GovukButton";
import { CsrfField } from "../../components/CsrfField";

type CounterProps = {
  initialCount: number;
  csrfToken: string;
};

/**
 * Simple demo of the same action with and without JavaScript.
 * Both save the count on the server through POST /apply/increment.
 *
 * Without JS: the browser posts the form and the whole page reloads.
 * With JS: event.preventDefault() stops that post and reload. React updates
 * the number on the page straight away, then fetch sends the same request in
 * the background to save it.
 *
 * For a realistic example of an island, see the permit options form
 * (pages/customise/CustomiseForm.tsx).
 */
export function Counter({ initialCount, csrfToken }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Don't let the browser send the form and reload
    setCount(count + 1); // Update the page now, without waiting for the server
    await fetch("/apply/increment", {
      method: "POST",
      headers: { Accept: "application/json" }, // Tells the server we are not a plain form post
      body: new URLSearchParams({ _csrf: csrfToken }), // Same hidden field a form post would send
    });
  }

  return (
    <div className="app-counter">
      <h2 className="govuk-heading-m">Demo: simple counter island</h2>
      <p className="govuk-body">
        Try this with JavaScript on and off. The count is saved either way. With
        JS off, every click reloads the page. With JS on, the number updates
        instantly and the page does not reload.
      </p>
      <p className="govuk-body">
        Current count: <strong id="counter-value">{count}</strong>
      </p>
      <form method="post" action="/apply/increment" onSubmit={onSubmit}>
        <CsrfField token={csrfToken} />
        <GovukButton type="submit">Increment counter</GovukButton>
      </form>
    </div>
  );
}
