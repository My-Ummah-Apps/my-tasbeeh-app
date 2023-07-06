const link = (url) => {
  window.location.href = url;
};

const AboutUs = () => {
  return (
    <div className="about-us-modal">
      <div className="image-and-text-wrap">
        <img
          src="/images/My-Ummah-Apps-72ppi.png"
          height="50"
          width="auto"
          alt=""
        />

        <p className="about-us-organisation-text">
          MyUmmahApps Ltd is an organization driven by a passionate commitment
          to empower the Muslim community through cutting-edge Open Source
          mobile applications.{" "}
        </p>
      </div>
      <div className="links-wrap">
        <div
          className="privacy-policy-link-wrap"
          onClick={() => {
            link("https://sites.google.com/view/mytasbeehprivacypolicy/home");
          }}
        >
          <p> View App Privacy Policy</p>
        </div>
        <div
          className="open-source-link-wrap"
          onClick={() => {
            link("https://github.com/My-Ummah-Apps/my-tasbeeh-app");
          }}
        >
          <p> View App Source Code</p>
        </div>
      </div>
      <div className="attribution-wrap">
        <p>App Icon by: </p>
        <a
          href="https://www.flaticon.com/free-icons/number"
          title="number icons"
        >
          Zane Priedite - Flaticon
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
