import { useState, type FormEvent } from "react";
import { Button } from "../../components/Button";

type CounterProps = {
  initialCount: number;
};

/**
 * Simplest island: without JS the form POSTs to /apply/increment (server waits
 * 1.5 s then reloads); with JS, onSubmit updates the count instantly.
 */
export function Counter({ initialCount }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Don't send the form — handle it here instead
    setCount(count + 1);
  }

  return (
    <div className="app-counter">
      <h2 className="govuk-heading-m">Demo: simple counter island</h2>
      <p className="govuk-body">
        Try this with JavaScript on and off. With JS off, the server waits about
        1.5 seconds before responding. With JS on, the number updates instantly.
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
