import { useState, useEffect } from 'react';
import { recipes, categories, Recipe } from './data/recipes';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const recipesPerPage = 4;

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'var(--accent-green)';
      case 'medium': return 'var(--accent-blue)';
      case 'hard': return 'var(--accent-purple)';
      default: return 'var(--text-soft)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '0.5rem' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 1.2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '1.2rem' }}>📖</span>
          <h1 style={{
            fontSize: '1.4rem',
            color: 'var(--heading)',
            fontWeight: 'normal',
          }}>
            My Recipe Journal
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: 'var(--bg-soft)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: '1.4rem',
            height: '1.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            transition: 'all 0.3s',
            color: 'var(--text)',
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Search Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.2rem',
      }}>
        <div style={{
          position: 'relative',
          marginBottom: '0.6rem',
        }}>
          <input
            type="text"
            placeholder="Search recipes or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.6rem 0.4rem 1.4rem',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--text)',
              fontSize: '0.5rem',
              outline: 'none',
              transition: 'all 0.3s',
              boxShadow: 'var(--shadow)',
            }}
          />
          <span style={{
            position: 'absolute',
            left: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.5rem',
          }}>🔍</span>
        </div>
      </div>

      {/* Categories */}
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.2rem 0.6rem',
        display: 'flex',
        gap: '0.3rem',
        overflowX: 'auto',
        flexWrap: 'wrap',
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '20px',
              border: activeCategory === cat.id ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: activeCategory === cat.id ? 'var(--primary)' : 'var(--card)',
              color: activeCategory === cat.id ? '#fff' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '0.42rem',
              transition: 'all 0.3s',
              boxShadow: activeCategory === cat.id ? 'var(--shadow-hover)' : 'var(--shadow)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.15rem',
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* Recipe Grid */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.2rem',
      }}>
        {selectedRecipe ? (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={() => setSelectedRecipe(null)}
            getDifficultyColor={getDifficultyColor}
          />
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0.6rem',
            }}>
              {paginatedRecipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  getDifficultyColor={getDifficultyColor}
                  index={index}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="animate-fade-in" style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-soft)',
                fontSize: '0.6rem',
              }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🍽️</span>
                No recipes found. Try a different search!
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="animate-fade-in" style={{
                marginTop: '1rem',
                padding: '0.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                <span style={{ fontSize: '0.4rem', color: 'var(--text-soft)' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <input
                  type="range"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="page-slider"
                  style={{ maxWidth: '300px' }}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        marginTop: '1rem',
        color: 'var(--text-soft)',
        fontSize: '0.38rem',
      }}>
        Made with ❤️ and fresh ingredients
      </footer>
    </div>
  );
}

function RecipeCard({ recipe, onClick, getDifficultyColor, index }: {
  recipe: Recipe;
  onClick: () => void;
  getDifficultyColor: (d: string) => string;
  index: number;
}) {
  return (
    <div
      className="animate-slide-up"
      onClick={onClick}
      style={{
        background: 'var(--card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        padding: '0.6rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: 'var(--shadow)',
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'both',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      {/* Emoji Header */}
      <div style={{
        fontSize: '1.8rem',
        textAlign: 'center',
        padding: '0.4rem 0',
        background: 'var(--bg-soft)',
        borderRadius: '12px',
        marginBottom: '0.4rem',
      }}>
        {recipe.emoji}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '0.55rem',
        color: 'var(--heading)',
        marginBottom: '0.2rem',
        lineHeight: 1.3,
      }}>
        {recipe.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.38rem',
        color: 'var(--text-soft)',
        marginBottom: '0.4rem',
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {recipe.description}
      </p>

      {/* Meta Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.35rem',
        color: 'var(--text-soft)',
      }}>
        <span>⏱ {recipe.time}</span>
        <span>👥 {recipe.servings}</span>
        <span style={{
          color: getDifficultyColor(recipe.difficulty),
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }}>
          {recipe.difficulty}
        </span>
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        gap: '0.15rem',
        marginTop: '0.3rem',
        flexWrap: 'wrap',
      }}>
        {recipe.tags.map(tag => (
          <span key={tag} style={{
            padding: '0.08rem 0.2rem',
            borderRadius: '8px',
            background: 'var(--bg-soft)',
            fontSize: '0.3rem',
            color: 'var(--text-soft)',
          }}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onBack, getDifficultyColor }: {
  recipe: Recipe;
  onBack: () => void;
  getDifficultyColor: (d: string) => string;
}) {
  return (
    <div className="animate-fade-in" style={{
      background: 'var(--card)',
      borderRadius: '20px',
      border: '1px solid var(--border)',
      padding: '0.8rem',
      boxShadow: 'var(--shadow)',
    }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          background: 'var(--bg-soft)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '0.2rem 0.5rem',
          cursor: 'pointer',
          fontSize: '0.4rem',
          color: 'var(--text)',
          marginBottom: '0.5rem',
          transition: 'all 0.3s',
        }}
      >
        ← Back to recipes
      </button>

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '0.8rem',
        background: 'var(--bg-soft)',
        borderRadius: '16px',
        marginBottom: '0.6rem',
      }}>
        <span style={{ fontSize: '3rem' }}>{recipe.emoji}</span>
        <h2 style={{
          fontSize: '0.9rem',
          color: 'var(--heading)',
          marginTop: '0.3rem',
          lineHeight: 1.3,
        }}>
          {recipe.title}
        </h2>
        <p style={{
          fontSize: '0.4rem',
          color: 'var(--text-soft)',
          marginTop: '0.2rem',
          lineHeight: 1.5,
        }}>
          {recipe.description}
        </p>
      </div>

      {/* Meta */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.8rem',
        marginBottom: '0.6rem',
        flexWrap: 'wrap',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '0.2rem 0.4rem',
          background: 'var(--bg-soft)',
          borderRadius: '10px',
        }}>
          <div style={{ fontSize: '0.5rem' }}>⏱</div>
          <div style={{ fontSize: '0.35rem', color: 'var(--text-soft)' }}>{recipe.time}</div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '0.2rem 0.4rem',
          background: 'var(--bg-soft)',
          borderRadius: '10px',
        }}>
          <div style={{ fontSize: '0.5rem' }}>👥</div>
          <div style={{ fontSize: '0.35rem', color: 'var(--text-soft)' }}>{recipe.servings} servings</div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '0.2rem 0.4rem',
          background: 'var(--bg-soft)',
          borderRadius: '10px',
        }}>
          <div style={{ fontSize: '0.5rem' }}>📊</div>
          <div style={{ fontSize: '0.35rem', color: getDifficultyColor(recipe.difficulty), textTransform: 'capitalize' }}>
            {recipe.difficulty}
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div style={{ marginBottom: '0.6rem' }}>
        <h3 style={{
          fontSize: '0.55rem',
          color: 'var(--primary)',
          marginBottom: '0.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
        }}>
          🧺 Ingredients
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.15rem',
        }}>
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="animate-slide-in-right" style={{
              fontSize: '0.38rem',
              padding: '0.15rem 0.3rem',
              background: 'var(--bg-soft)',
              borderRadius: '8px',
              color: 'var(--text)',
              animationDelay: `${i * 0.05}s`,
              animationFillMode: 'both',
            }}>
              • {ing}
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div style={{ marginBottom: '0.6rem' }}>
        <h3 style={{
          fontSize: '0.55rem',
          color: 'var(--primary)',
          marginBottom: '0.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
        }}>
          👩‍🍳 Steps
        </h3>
        <ol style={{
          listStyle: 'none',
          padding: 0,
          counterReset: 'step',
        }}>
          {recipe.steps.map((step, i) => (
            <li key={i} className="animate-slide-up" style={{
              fontSize: '0.4rem',
              padding: '0.3rem',
              marginBottom: '0.2rem',
              background: 'var(--bg-soft)',
              borderRadius: '10px',
              color: 'var(--text)',
              lineHeight: 1.5,
              display: 'flex',
              gap: '0.3rem',
              alignItems: 'flex-start',
              animationDelay: `${i * 0.1}s`,
              animationFillMode: 'both',
            }}>
              <span style={{
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: '50%',
                minWidth: '0.7rem',
                height: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.3rem',
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        gap: '0.2rem',
        flexWrap: 'wrap',
        paddingTop: '0.3rem',
        borderTop: '1px solid var(--border)',
      }}>
        {recipe.tags.map(tag => (
          <span key={tag} style={{
            padding: '0.1rem 0.3rem',
            borderRadius: '10px',
            background: 'var(--accent-green)',
            color: '#fff',
            fontSize: '0.3rem',
          }}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
