/* =========================================================
   StateCrafter DCU
   Authentication
   ========================================================= */

const SUPABASE_URL =
  "https://psqwnvgruyfgdoukvpid.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_laa0xdMjKu2WV70goHPD-A_uW_ART3c";


/* =========================================================
   SUPABASE CLIENT
   ========================================================= */

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================================
   LOGIN
   ========================================================= */

async function loginUser(email, password) {

  const {
    data,
    error
  } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });


  if (error) {
    throw error;
  }


  if (!data || !data.user) {

    throw new Error(
      "Sign in failed. User account could not be found."
    );

  }


  const user =
    data.user;


  /*
   * Load the user's profile.
   *
   * profiles.id must match auth.users.id
   */

  const {
    data: profile,
    error: profileError
  } =
    await supabaseClient
      .from("profiles")
      .select(
        "id, full_name, role, campus, session, student_id, photo_url"
      )
      .eq(
        "id",
        user.id
      )
      .single();


  if (profileError || !profile) {

    await supabaseClient.auth.signOut();

    console.error(
      "Profile error:",
      profileError
    );

    throw new Error(
      "Your account exists, but your student profile was not found. Please contact the administrator."
    );

  }


  /*
   * ADMIN
   */

  if (profile.role === "admin") {

    window.location.href =
      "admin-dashboard.html";

    return;

  }


  /*
   * STUDENT
   */

  if (profile.role === "student") {

    window.location.href =
      "student-dashboard.html";

    return;

  }


  /*
   * UNKNOWN ROLE
   */

  await supabaseClient.auth.signOut();

  throw new Error(
    "Your account role is not configured correctly."
  );

}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logoutUser() {

  try {

    await supabaseClient.auth.signOut();

  } finally {

    window.location.href =
      "login.html";

  }

}


/* =========================================================
   GET CURRENT USER
   ========================================================= */

async function getCurrentUser() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();


  if (error) {

    console.error(
      "Get user error:",
      error
    );

    return null;

  }


  return data.user || null;

}


/* =========================================================
   GET CURRENT PROFILE
   ========================================================= */

async function getCurrentProfile() {

  const user =
    await getCurrentUser();


  if (!user) {

    return null;

  }


  const {
    data,
    error
  } =
    await supabaseClient

      .from("profiles")

      .select("*")

      .eq(
        "id",
        user.id
      )

      .single();


  if (error) {

    console.error(
      "Profile load error:",
      error
    );

    return null;

  }


  return data;

}


/* =========================================================
   REDIRECT LOGGED-IN USER
   ========================================================= */

async function redirectLoggedInUser() {

  const user =
    await getCurrentUser();


  if (!user) {

    return false;

  }


  const {
    data: profile,
    error
  } =
    await supabaseClient

      .from("profiles")

      .select("role")

      .eq(
        "id",
        user.id
      )

      .single();


  if (error || !profile) {

    console.error(
      "Redirect profile error:",
      error
    );

    return false;

  }


  if (profile.role === "admin") {

    window.location.href =
      "admin-dashboard.html";

    return true;

  }


  if (profile.role === "student") {

    window.location.href =
      "student-dashboard.html";

    return true;

  }


  return false;

}
