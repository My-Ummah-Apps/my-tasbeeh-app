// import logo from "./src/pics/My-Ummah-Apps-72ppi.png"; // Tell Webpack this JS file uses this image

const link = (url) => {
  window.location.href = url;
};

const AboutUs = () => {
  return (
    <div className="about-us-modal">
      <div className="image-and-text-wrap">
        <img
          src="/src/pics/My-Ummah-Apps-72ppi.png"
          height="100"
          width="100"
          alt=""
        />

        <p>
          MyUmmahApps Ltd, founded in 2023, is an organization driven by a
          passionate commitment to empower the Muslim community through
          cutting-edge Open Source mobile applications.{" "}
        </p>
      </div>
      <div
        className="privacy-policy-link-wrap"
        onClick={() => {
          link("https://sites.google.com/view/mytasbeehprivacypolicy/home");
        }}
      >
        <p> View App Privacy Policy</p>
      </div>
    </div>
  );
};

export default AboutUs;
