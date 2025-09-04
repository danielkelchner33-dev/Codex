import React from "react";

const pastel = {
  surf: "#AEE6E6",
  sand: "#FDF6E3",
  coral: "#FFB6B9",
  sky: "#B8E1FF",
  berry: "#7D5FFF",
  coconut: "#FFE6B6",
};

const buttonStyle = {
  background: `linear-gradient(90deg, ${pastel.coral}, ${pastel.surf})`,
  color: "#1B2A41",
  padding: "1rem 2.5rem",
  border: "none",
  borderRadius: "2rem",
  fontWeight: "bold",
  fontSize: "1.2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  cursor: "pointer",
  marginTop: "1.2rem",
  transition: "transform .2s",
};

export default function Home() {
  return (
    <div style={{
      fontFamily: "'Inter', 'Montserrat', Arial, sans-serif",
      background: `linear-gradient(120deg, ${pastel.sky} 0%, ${pastel.sand} 100%)`,
      minHeight: "100vh",
      color: "#1B2A41",
    }}>
      {/* Hero Section */}
      <section style={{
        textAlign: "center",
        padding: "5rem 1rem 3rem",
        background: `linear-gradient(120deg, ${pastel.surf} 70%, ${pastel.coconut} 100%)`,
      }}>
        <h1 style={{
          fontSize: "2.8rem",
          fontWeight: 800,
          letterSpacing: "-1px",
          color: pastel.berry,
        }}>
          500 Jars. Once They’re Gone, They’re Gone.
        </h1>
        <p style={{
          fontSize: "1.3rem",
          maxWidth: 600,
          margin: "2rem auto",
          color: "#224C4C",
        }}>
          Small-batch, artisan berry jam made with only fruit and a touch of organic coconut sugar. No pectin. No fillers. No compromise.
        </p>
        <button style={buttonStyle}>
          Reserve Your Bundle Now &rarr;
        </button>
      </section>

      {/* Dan’s Jams Difference */}
      <section style={{
        padding: "3.5rem 1rem",
        maxWidth: 900,
        margin: "0 auto",
      }}>
        <h2 style={{
          fontSize: "2rem",
          color: pastel.berry,
          marginBottom: "2rem",
        }}>
          The Dan’s Jams Difference
        </h2>
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.6rem",
        }}>
          {[
            "Only 4g added sugar per serving",
            "Organic coconut sugar — never refined cane sugar",
            "Just fruit + coconut sugar — nothing else",
            "No pectin, no preservatives, no fillers",
            "Handmade in small batches for vibrant, real fruit flavor",
          ].map((item, i) => (
            <li key={i} style={{
              background: pastel.sky,
              borderRadius: "1rem",
              padding: "1.2rem 1.5rem",
              fontWeight: 500,
              color: "#1B2A41",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>{item}</li>
          ))}
        </ul>
        <p style={{marginTop: "2rem", fontSize: "1.1rem", color: "#224C4C"}}>
          Every jar of Dan’s Jams is the purest form of jam you can buy. We believe the best ingredients don’t need to hide behind additives — just nature’s own sweetness, perfectly balanced.
        </p>
      </section>

      {/* Why Coconut Sugar */}
      <section style={{
        background: pastel.coconut,
        padding: "3rem 1rem",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "1.7rem",
          color: pastel.berry,
          marginBottom: "1rem"
        }}>
          Why Coconut Sugar?
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          maxWidth: 800,
          margin: "0 auto"
        }}>
          <ul style={{textAlign: "left", fontSize: "1rem", color: "#224C4C"}}>
            <li>Lower Glycemic Index – GI of ~35 vs. ~60–65 for cane sugar, leading to a slower rise in blood glucose.</li>
            <li>Trace Minerals – Naturally contains small amounts of iron, zinc, calcium, potassium, and antioxidants.</li>
            <li>Natural Inulin Fiber – Supports digestion and slows sugar absorption.</li>
            <li>Caramel-Like Flavor – Enhances berries instead of overpowering them.</li>
          </ul>
          <div style={{
            background: pastel.surf,
            borderRadius: "1rem",
            padding: "1rem 1.2rem",
            fontSize: "1rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            color: "#1B2A41",
          }}>
            <b style={{fontSize:"1.1rem"}}>🌴 Did You Know?</b><br/>
            Coconut palms produce <b>50–75% more sugar per acre</b> than cane sugar and use only ~20% of the resources 🌱.<br/><br/>
            Coconut sugar naturally contains magnesium, potassium, zinc, iron, B vitamins, and amino acids.<br/><br/>
            Its light caramel flavor makes it the perfect sweetener for coffee, smoothies, yogurt, baking — and jam.<br/><br/>
            Works as a 1:1 replacement for refined sugar.<br/><br/>
            We keep the sweetness light — only 4g of added sugar per serving — so you can actually taste the berries, not just sugar.
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section style={{padding: "3rem 1rem", maxWidth: 900, margin: "0 auto"}}>
        <h2 style={{
          fontSize: "1.7rem",
          color: pastel.berry,
          marginBottom: "1rem",
        }}>Our Process</h2>
        <p style={{fontSize: "1.1rem", color: "#224C4C", marginBottom: "1.2rem"}}>
          No mass production. No shortcuts.<br/>
          We make every jar in small batches of just a few dozen at a time, slow-cooking organic berries in open kettles so the flavor stays fresh and full.<br/>
          We never add pectin.<br/>
          We never add preservatives.<br/>
          We never add anything you can’t pronounce.<br/>
          Just real fruit. A little organic coconut sugar. And time.
        </p>
      </section>

      {/* Storage & Freshness */}
      <section style={{
        background: pastel.sky,
        padding: "2.5rem 1rem",
        maxWidth: 900,
        margin: "2rem auto",
        borderRadius: "1.2rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          color: pastel.berry,
          marginBottom: "1rem",
        }}>Storage & Freshness</h2>
        <ul style={{fontSize: "1rem", color: "#224C4C"}}>
          <li><b>Shelf Stable:</b> Shelf-stable for up to 1 year unopened.</li>
          <li><b>Refrigerate Upon Purchase:</b> Even if unopened, refrigerate when you get it home to preserve flavor, color, and nutrients.</li>
          <li><b>After Opening:</b> Best taste within 30 days. Good for up to 90 days if kept cold.</li>
        </ul>
      </section>

      {/* Limited-Batch Guarantee & Offer */}
      <section style={{
        background: pastel.sand,
        padding: "3rem 1rem",
        textAlign: "center",
        margin: "2rem 0",
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          color: pastel.berry,
        }}>Limited-Batch Guarantee</h2>
        <p style={{
          fontSize: "1.1rem",
          color: "#224C4C",
        }}>
          We only make 500 jars per month.<br/>
          When they sell out, you’ll have to wait for the next batch.<br/>
          <b>Next Batch Ships:</b> <span style={{color: pastel.coral, fontWeight: 600}}>[Insert Date]</span><br/>
          <b>Jars Remaining:</b> <span style={{
            fontWeight: 800,
            color: pastel.berry,
            fontSize: "1.2rem"
          }}>[Dynamic Counter]</span>
        </p>
        <div style={{
          background: pastel.sky,
          borderRadius: "1.1rem",
          display: "inline-block",
          padding: "2rem 2.5rem",
          margin: "2rem 0",
          boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
        }}>
          <h3 style={{color: pastel.coral, fontSize: "1.2rem", marginBottom: "1rem"}}>Special Bundle Offer – Save & Stock Up</h3>
          <ul style={{
            listStyle: "none",
            padding: 0,
            color: "#224C4C",
            fontSize: "1.05rem"
          }}>
            <li>Most customers buy <b>3 jars</b> to make sure they don’t run out before next month’s batch.</li>
            <li><b>3-Jar Bundle</b> – $34.99 + <b>FREE Shipping</b></li>
            <li>Save compared to buying single jars</li>
            <li>Stock up for breakfast, snacks, and gifts</li>
            <li>Secure your share before we sell out</li>
          </ul>
          <button style={buttonStyle}>
            Get the 3-Jar Bundle &rarr;
          </button>
        </div>
      </section>

      {/* Customer Love */}
      <section style={{
        padding: "2rem 1rem",
        maxWidth: 900,
        margin: "0 auto",
        textAlign: "center",
      }}>
        <h2 style={{
          color: pastel.berry,
          fontSize: "1.5rem",
          marginBottom: "1rem",
        }}>Customer Love</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.4rem",
        }}>
          {[
            "“Finally, a jam I feel good about eating. It’s real fruit, not sugar with a hint of berries.” – Sarah M.",
            "“The flavor is insane. You can taste the berries, and the sweetness is just right.” – Michael T.",
            "“I bought 3 jars thinking I’d give some away. I didn’t. Sorry, friends.” – Jennifer P."
          ].map((text, i) => (
            <blockquote key={i} style={{
              background: pastel.coconut,
              borderRadius: "1rem",
              padding: "1rem 1.2rem",
              fontStyle: "italic",
              color: "#224C4C",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
            }}>{text}</blockquote>
          ))}
        </div>
      </section>

      {/* Shop Section */}
      <section style={{
        background: pastel.sky,
        padding: "2.5rem 1rem",
        maxWidth: 900,
        margin: "2rem auto",
        borderRadius: "1.2rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          color: pastel.berry,
          marginBottom: "1rem",
        }}>Shop</h2>
        <div style={{
          background: pastel.surf,
          display: "inline-block",
          padding: "2rem 2.5rem",
          borderRadius: "1.2rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
        }}>
          <h3 style={{color: pastel.berry, fontSize: "1.2rem"}}>Superfood Berry Blend – 9 oz Jar</h3>
          <p style={{fontSize: "1rem", color: "#224C4C"}}>
            A rich, deep purple jam made from a blend of organic blueberries, raspberries, blackberries, and cherries. Just fruit + organic coconut sugar.<br/>
            Only 4g added sugar per serving.
          </p>
          <p style={{fontWeight: 600, fontSize: "1.08rem", color: pastel.berry}}>
            Single Jar: $16.99
            <br/>
            <span style={{fontWeight: 700, color: pastel.coral}}>3-Jar Bundle: $34.99 + Free Shipping</span>
          </p>
          <button style={buttonStyle}>
            Add to Cart
          </button>
        </div>
      </section>

      {/* About Dan */}
      <section style={{
        padding: "3rem 1rem",
        maxWidth: 900,
        margin: "0 auto",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          color: pastel.berry,
          marginBottom: "1rem",
        }}>About Dan</h2>
        <p style={{fontSize: "1.08rem", color: "#224C4C", maxWidth: 700, margin: "0 auto"}}>
          Dan’s Jams started in a tiny coastal kitchen when Dan — surfer, home cook, and health nut — realized every “healthy” jam on the market was either loaded with sugar or packed with fake sweeteners.<br/><br/>
          So he made his own.<br/>
          Small batches. Pure ingredients. Clean sweetness.<br/>
          Now, each month, only 500 people get to taste what he calls the cleanest jam on earth.
        </p>
      </section>
    </div>
  );
}
