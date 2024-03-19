document.addEventListener("DOMContentLoaded", function () {
  // Sample data for featured games
  const featuredGames = [
    {
      title: "Genshin Impact",
      image: "https://pbs.twimg.com/media/GH6xcJUXkAAdaBv.jpg:large",
      description: "Version 4.5 introduces Chjori...",
    },
    {
      title: "Horizon Forbidden West",
      image:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/69be345f-a316-4df1-be66-ac63a2a07d34/d9ii18n-e0d8b7f7-83f9-408a-9259-791e86a08489.jpg/v1/fill/w_1024,h_712,q_75,strp/200_best_video_games_of_all_time_book_cover_by_thormeister_d9ii18n-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzEyIiwicGF0aCI6IlwvZlwvNjliZTM0NWYtYTMxNi00ZGYxLWJlNjYtYWM2M2EyYTA3ZDM0XC9kOWlpMThuLWUwZDhiN2Y3LTgzZjktNDA4YS05MjU5LTc5MWU4NmEwODQ4OS5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.mhYplenAv1EIhBZh52ybpLMxWcyoc9aTFz1Teww3240",
      description: "Experience the epic Horizon Forbidden West...",
    },
    // Add more featured games here
  ];

  // Sample data for game cards
  const gameData = [
    {
      title: 'SKULL AND BONES',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3XFlNwfVVcLTZQWMOIeHuEk-06AKu7aMcoA&usqp=CAU',
      discount: '-25%',
      originalPrice: '$59.99',
      salePrice: '$44.99'
    },
    {
      title: 'FIFA 24',
      image: 'https://www.xtrafondos.com/wallpapers/vertical/stray-videojuego-portada-11201.jpg',
      discount: '-80%',
      originalPrice: '$69.99',
      salePrice: '$13.99'
    },
    // ... Add other games here
  ];



  const carouselItems = document.getElementById("carouselItems");
  const gameCardsContainer = document.getElementById("gameCards1");

  // Populate featured games
  featuredGames.forEach((game, index) => {
    let div = document.createElement("div");
    div.className = `carousel-item ${index === 0 ? "active" : ""}`;
    div.innerHTML = `
        <img src="${game.image}" alt="${game.title}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${game.title}</h5>
          <p>${game.description}</p>
        </div>
      `;
    carouselItems.appendChild(div);
  });

  // Populate game cards
  gameData.forEach(game => {
    let col = document.createElement('div');
    col.className = 'col-md-3 col-sm-6 mb-4';
    col.innerHTML = `
      <div class="card game-card">
        <img src="${game.image}" class="card-img-top" alt="${game.title}">
        <div class="card-body">
          <h5 class="card-title">${game.title}</h5>
          <p class="card-text">BASE GAME</p>
          <div class="game-price">
            <span class="discount">${game.discount}</span>
            <span class="original-price">${game.originalPrice}</span>
            <span class="sale-price">${game.salePrice}</span>
          </div>
          <button class="btn btn-primary btn-block mt-3">Buy Now</button>
        </div>
      </div>
    `;
    gameCardsContainer.appendChild(col);
  });
});
