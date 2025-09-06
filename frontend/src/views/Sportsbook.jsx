import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const api_key = '584a99cdedc9f4d1ae05c11498efcb5a'; // Use your API key

function Sportsbook() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveGames = async () => {
      try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
          params: { live: 'all' },
          headers: { 'x-apisports-key': api_key }
        });

        if (!response.data || !response.data.response) {
          throw new Error('No data received from API');
        }

        const matches = response.data.response || [];
        console.log('Matches received:', matches); // Debug log

        const matchesWithOdds = await Promise.all(matches.map(async match => {
          try {
            const oddsResponse = await axios.get('https://v3.football.api-sports.io/odds', {
              params: { fixture: match.fixture.id },
              headers: { 'x-apisports-key': api_key },
              timeout: 5000 // Add timeout
            });

            console.log('Odds for match:', match.fixture.id, oddsResponse.data); // Debug log

            const markets = oddsResponse.data.response[0]?.bookmakers[0]?.bets || [];
            return {
              match_id: match.fixture.id,
              home_team: match.teams.home.name,
              away_team: match.teams.away.name,
              status: match.fixture.status.long,
              score: {
                home: match.goals.home || 0,
                away: match.goals.away || 0
              },
              markets: markets.filter(market => !market.values.every(v => v.odd === null || v.odd <= 1.0))
            };
          } catch (oddsError) {
            console.error(`Error fetching odds for match ${match.fixture.id}:`, oddsError);
            // Return match data without odds if odds fetch fails
            return {
              match_id: match.fixture.id,
              home_team: match.teams.home.name,
              away_team: match.teams.away.name,
              status: match.fixture.status.long,
              score: {
                home: match.goals.home || 0,
                away: match.goals.away || 0
              },
              markets: []
            };
          }
        }));

        console.log('Processed matches:', matchesWithOdds); // Debug log
        setMatches(matchesWithOdds);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching live games:', error);
        let errorMessage = 'An error occurred while fetching data';
        if (error.message === 'Network Error') {
          errorMessage = 'Network error occurred. Retrying...';
          // Retry the failed request after 5 seconds
          setTimeout(fetchLiveGames, 5000);
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchLiveGames();
    // Refresh data every minute
    const interval = setInterval(fetchLiveGames, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    </Box>
  );

  if (!matches || matches.length === 0) return (
    <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Typography>No live matches available at the moment</Typography>
    </Box>
  );

  return (
    <Box style={{ padding: 24 }}>
      <Typography variant="h3" gutterBottom>Live Soccer Matches</Typography>
      <Grid container spacing={3}>
        {matches.map(match => (
          <Grid item xs={12} md={6} lg={4} key={match.match_id}>
            <Card style={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {match.home_team} vs {match.away_team}
                </Typography>
                <Typography color="textSecondary">
                  Status: {match.status}
                </Typography>
                <Typography variant="h6" sx={{ my: 1 }}>
                  {match.score.home} - {match.score.away}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Available Markets
                </Typography>
                {match.markets.length > 0 ? (
                  match.markets.map((market, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 1, p: 1 }}>
                      <Typography variant="body1">
                        {market.name}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {market.values.map((value, vIndex) => (
                          <Typography key={vIndex} variant="body2" color="textSecondary">
                            {value.value}: {value.odd}
                          </Typography>
                        ))}
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Typography color="textSecondary">
                    No betting markets available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Sportsbook;