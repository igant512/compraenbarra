const handleJoin = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await joinOffer(offer.id, 1);
    if (result?.error) {
      setError(result.error);
    }
  } catch (err: any) {
    setError('Ocurrió un error inesperado.');
  } finally {
    setLoading(false);
  }
};
