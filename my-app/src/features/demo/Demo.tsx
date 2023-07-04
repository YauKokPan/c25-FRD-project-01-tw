import React, { useCallback, useEffect, useMemo, useState } from "react";

// fieldOne
// fieldTwo

interface FormInput {
  fieldOne: string;
  fieldTwo: string;
}

function Demo() {
  const [data, setData] = useState<number[]>([]);
  const [form, setForm] = useState<FormInput>({
    fieldOne: "123",
    fieldTwo: "456",
  });

  useEffect(() => {
    fetch("/data.json")
      .then((resp) => resp.json())
      .then((data) => setData(data));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((state) => ({ ...state, [e.target.name]: e.target.value }));
  }, []);

  const filteredData = useMemo(
    () =>
      data.filter((num) => {
        console.log("testing filter...");
        return num % 2 === 0;
      }),
    [data]
  );

  return (
    <div>
      <h1>{JSON.stringify(data)}</h1>
      <h1>{JSON.stringify(filteredData)}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(form);
        }}
      >
        <h3>Demo Form</h3>
        <div>
          <label htmlFor="fieldOne">Field One</label>
          <input
            type="text"
            name="fieldOne"
            id="fieldOne"
            value={form.fieldOne}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="fieldTwo">Field Two</label>
          <input
            type="text"
            name="fieldTwo"
            id="fieldTwo"
            value={form.fieldTwo}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Demo;
