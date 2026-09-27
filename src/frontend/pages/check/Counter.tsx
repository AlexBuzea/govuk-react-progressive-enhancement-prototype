import { useState, type FormEvent } from "react";
import { Button } from "../../components/Button";

type CounterProps = {
  initialCount: number;
};

/**
 * Progressive enhancement demo.
 * - Without JS: the form POSTs to the server and the page reloads
 * - With JS: client.tsx hydrates this component, so the count
 *   updates instantly without a reload
 */
export function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Stop the normal form POST — update in the browser instead
    event.preventDefault();
    const next = count + 1;
    setCount(next);
    console.log("[client] counter incremented →", next);
  }

  return (
    <div className="app-counter">
      <h2 className="govuk-heading-m">Demonstration counter</h2>
      <p className="govuk-body">
        With JavaScript disabled, this button posts to the server and reloads the
        page. With JavaScript enabled, React hydrates this component and updates
        the count instantly.
      </p>
      <p className="govuk-body">
        Current count: <strong id="counter-value">{count}</strong>
      </p>
      <form method="post" action="/check/increment" onSubmit={onSubmit}>
        <Button type="submit">Increment counter</Button>
      </form>
    </div>
  );
}
