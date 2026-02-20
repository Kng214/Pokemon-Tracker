package com.pokemonprofit.backend.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Sale {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  private User user;

  private LocalDate date;

  @ManyToOne
  private Card card;

  @ManyToOne
  private SealedProduct sealedProduct;

  @Column(nullable = false)
  private BigDecimal price;

  @Column(nullable = false)
  private Integer quantity = 1;

  private String platform;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }

  public LocalDate getDate() { return date; }
  public void setDate(LocalDate date) { this.date = date; }

  public Card getCard() { return card; }
  public void setCard(Card card) { this.card = card; }

  public SealedProduct getSealedProduct() { return sealedProduct; }
  public void setSealedProduct(SealedProduct sealedProduct) { this.sealedProduct = sealedProduct; }

  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }

  public Integer getQuantity() { return quantity; }
  public void setQuantity(Integer quantity) { this.quantity = quantity; }

  public String getPlatform() { return platform; }
  public void setPlatform(String platform) { this.platform = platform; }
}
