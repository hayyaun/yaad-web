const title = "یاد، وزنه ای برای \nاز بین بردن نابرابری آموزشی";
const desc = "نابرابری آموزشی یکی از بزرگترین مشکلات کشور است";

export default function Content() {
  return (
    <div
      dir="rtl"
      className="column"
      style={{
        height: "100%",
        gap: "1.5rem",
        alignItems: "flex-start",
        justifyContent: "center",
        whiteSpace: "pre",
      }}
    >
      <h1>{title}</h1>
      <h5 style={{ color: "#fff6" }}>{desc}</h5>
      <div className="row">
        <button className="color-accent">دریافت</button>
        <button className="btn-bare">بلاگ</button>
      </div>
    </div>
  );
}
