const SUPABASE_URL = "https://psqwnvgruyfgdoukvpid.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_laa0xdMjKu2WV70goHPD-A_uW_ART3c";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ============================================
// REGISTER STUDENT
// ============================================

async function registerStudent({
  fullName,
  email,
  session,
  studentId,
  campus,
  password
}) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: fullName,
        session: session,
        student_id: studentId || null,
        campus: campus
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
}


// ============================================
// LOGIN
// ============================================

async function loginUser(email, password) {
  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    throw error;
  }

  return data;
}


// ============================================
// GET CURRENT USER
// ============================================

async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabaseClient.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}


// ============================================
// GET PROFILE
// ============================================

async function getCurrentProfile() {

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


// ============================================
// LOGOUT
// ============================================

async function logoutUser() {

  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    throw error;
  }

  window.location.href = "login.html";
}
