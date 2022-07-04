<template>
  <section>
    <h1>About</h1>
    <h2>About DTT Real Estate</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
      recusandae nam, cupiditate sed tenetur delectus reiciendis placeat
      quibusdam. Suscipit debitis in, aut consectetur ad maxime voluptatum
      repellendus labore eos earum ex deleniti reprehenderit eligendi autem!
      Laborum, vitae quis! Autem, accusantium!
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
      voluptatum consequuntur blanditiis? Fuga, officiis facere.
    </p>
    <h2>Design and Development</h2>
    <div class="contact">
      <!-- <img
        src="../assets/Frontend_Internship_Test_Slices/img_logo_dtt.png"
        alt=""
      /> -->
      <img src="../assets/logo2.png" alt="" />
      <div>
        <p>By The Realest Estate</p>
        <a href="https://www.therealestestate.com" target="_blank"
          >www.therealestestate.com</a
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style>
h1 {
  text-align: center;
  font-size: 22px;
}
h2 {
  margin-top: 3rem;
  font-size: 18px;
}
p {
  color: var(--secondary-text-color);
  font-size: 14px;
}
.contact {
  display: flex;
  align-items: center;
}
.contact img {
  margin-right: 1rem;
  margin-top: -0.6rem;
}
.contact div {
  display: flex;
  flex-direction: column;
}
.contact div p {
  margin: 0;
}
.contact a {
  color: blue;
}
@media screen and (min-width: 1000px) {
  .contact a {
    font-size: 14px;
  }
}
</style>
