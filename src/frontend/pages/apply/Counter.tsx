import { useState, type FormEvent } from "react";
import { Button } from "../../components/Button";

type CounterProps = {
  initialCount: number;
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
export function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Don't let the browser send the form and reload
    setCount(count + 1); // Update the page now, without waiting for the server
    await fetch("/apply/increment", {
      method: "POST",
      headers: { Accept: "application/json" }, // Tells the server we are not a plain form post
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
        <Button type="submit">Increment counter</Button>
      </form>
    </div>
  );
}
