import { useEffect, useState, type FormEvent } from "react";
import type { CustomiseData, CustomiseErrors } from "../../../shared/types";
import { Button } from "../../components/Button";
import { ErrorSummary } from "../../components/ErrorSummary";
import { Radios } from "../../components/Radios";
import { TextInput } from "../../components/TextInput";
import {
  calculatePrice,
  DURATIONS,
  filterZones,
  formatPrice,
  hasErrors,
  validateCustomise,
  VISITOR_BAY_PRICE,
  YES_NO,
} from "./options";

type CustomiseFormProps = {
  initialValues: CustomiseData;
  initialErrors: CustomiseErrors;
  initialZoneQuery: string;
};

/**
 * Works as a normal HTML form (POST /customise). With JS, React validates
 * before submit and updates price / zone list as you choose.
 * Choices and rules live in ./options.ts, shared with the server.
 */
export function CustomiseForm({
  initialValues,
  initialErrors,
  initialZoneQuery,
}: CustomiseFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [zoneQuery, setZoneQuery] = useState(initialZoneQuery);

  // Used below to show different content with and without JS.
  // false on the server and during hydration (so both render the same HTML);
  // true once React is running in the browser. Without JS it stays false.
  const [jsEnabled, setJsEnabled] = useState(false);
  useEffect(() => setJsEnabled(true), []);

  const price = calculatePrice(values.duration, values.visitorBay);
  const visibleZones = filterZones(zoneQuery);

  function update(field: keyof CustomiseData, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  // With JS: checks the answers before sending, so errors show instantly with no
  // reload. Without JS this never runs: the form posts and the server runs the
  // same validateCustomise() rules, then shows the form again with the errors.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validateCustomise(values);
    if (hasErrors(nextErrors)) {
      event.preventDefault(); // Stop the post so the page does not reload
      setErrors(nextErrors);
    }
    // Otherwise the browser submits normally and the server saves
  }

  return (
    <form method="post" action="/customise" noValidate onSubmit={onSubmit}>
      <ErrorSummary errors={errors} />

      {/*
        The radio buttons below are controlled by React (value + onChange).
        With JS: choosing an option updates the price and clears that field's error at once.
        Without JS: they are plain radio buttons and nothing changes until the form is posted.
      */}
      <Radios
        name="duration"
        legend="How long do you need the permit?"
        options={DURATIONS.map((d) => ({ value: d.value, label: `${d.label} (£${d.price})` }))}
        value={values.duration}
        onChange={(value) => update("duration", value)}
        error={errors.duration}
      />

      <Radios
        name="visitorBay"
        legend={`Do you need a visitor bay? (+£${VISITOR_BAY_PRICE})`}
        options={YES_NO}
        value={values.visitorBay}
        onChange={(value) => {
          update("visitorBay", value);
          if (value === "no") update("visitorEndDate", "");
        }}
        error={errors.visitorBay}
      />

      {/*
        With JS: hidden until the user answers "Yes" to the visitor bay question.
        Without JS: always shown, because nothing can react to the radio buttons.
        The hint text explains it is only needed for a visitor bay.
        The field stays in the form when hidden, so the server still receives it.
      */}
      <TextInput
        name="visitorEndDate"
        label="Visitor bay end date"
        hint="Only needed if you need a visitor bay. For example, 31/12/2026"
        className="govuk-input--width-10"
        autoComplete="off"
        value={values.visitorEndDate}
        onChange={(event) => update("visitorEndDate", event.target.value)}
        error={errors.visitorEndDate}
        hidden={jsEnabled && values.visitorBay !== "yes"}
      />

      {/*
        With JS: the total recalculates every time duration or visitor bay changes.
        Without JS: this shows only what was last saved, and the hint at the bottom
        says the total is confirmed on the next page.
      */}
      <div className="app-price-box" aria-live="polite">
        <h2 className="govuk-heading-m">Estimated total</h2>
        <p className="govuk-body govuk-!-margin-bottom-0">
          {price == null ? (
            "Select a duration to see a price."
          ) : (
            <>
              <strong className="app-price-box__amount">{formatPrice(price)}</strong>
              {values.visitorBay === "yes" ? (
                <span className="govuk-hint"> Includes £{VISITOR_BAY_PRICE} visitor bay</span>
              ) : null}
            </>
          )}
        </p>
        {!jsEnabled ? (
          <p className="govuk-hint">
            With JavaScript off, the total is confirmed on the next page.
          </p>
        ) : null}
      </div>

      {/*
        With JS: the zone list below filters as you type (see visibleZones).
        Without JS: the user types, then selects the "Filter zones" button, which
        reloads the page with ?q=... so the server can filter the list.
      */}
      <TextInput
        name="q"
        label="Filter zones"
        hint={
          jsEnabled
            ? "The list filters as you type."
            : "Type part of a zone name, then select Filter zones."
        }
        type="search"
        className="govuk-input--width-20"
        autoComplete="off"
        value={zoneQuery}
        onChange={(event) => setZoneQuery(event.target.value)}
      />
      {!jsEnabled ? (
        // Only shown without JS, because with JS the list already filters as you type.
        // formMethod="get" sends this one button as a GET (?q=...) instead of the form's POST.
        <Button type="submit" className="govuk-button--secondary" formMethod="get" formAction="/customise">
          Filter zones
        </Button>
      ) : null}

      {/* visibleZones is the full list, or the list narrowed by the filter above */}
      <Radios
        name="zoneId"
        legend="Parking zone"
        options={visibleZones.map((zone) => ({
          value: zone.id,
          label: `${zone.name} (${zone.id}) — ${zone.area}`,
        }))}
        value={values.zoneId}
        onChange={(value) => update("zoneId", value)}
        error={errors.zoneId}
      />
      {visibleZones.length === 0 ? (
        <p className="govuk-body">No zones match your filter.</p>
      ) : null}

      <Button type="submit">Continue</Button>
    </form>
  );
}
